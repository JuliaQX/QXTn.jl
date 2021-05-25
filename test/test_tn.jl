using ITensors

@testset "Test TensorNetwork struct and interface functions" begin
    # create empty tensor network
    tn = TensorNetwork()

    # create two tensors with one common index
    i1 = Index(2)
    i2 = Index(3)
    a_inds = [i1, Index(4)]
    b_inds = [i1, i2]
    tensor_a = push!(tn, a_inds, rand(2, 4))
    tensor_b = push!(tn, b_inds, rand(2, 3))
    @test length(tn) == 2
    @test length(collect(tn)) == 2

    # check the number of bonds 2
    # and that i1 connects to two tensors
    @test length(bonds(tn)) == 3
    @test length(tn[i1]) == 2
    @test all(tn[i1] .== [tensor_a, tensor_b])

    @test length(keys(tn)) == 2
    @test length(tn) == 2

    @test size(tensor_data(tn, tensor_a)) == (2, 4)

    tn2 = TensorNetwork()
    tensor_c = push!(tn2, [i2], rand(3))
    tn3 = merge(tn, tn2)
    @test length(tn3) == 3
    @test length(tn3[i2]) == 2

    @test length(neighbours(tn, tensor_b)) == 1
    @test length(neighbours(tn3, tensor_b)) == 2

    # Test delete!
    delete!(tn, tensor_a)
    @test length(tn) == 1
    @test haskey(tn.tensor_map, tensor_a) == false
    @test length(neighbours(tn, tensor_b)) == 0

    # Test TN copy
    a = TensorNetwork()
    tensor_a = push!(a, a_inds, rand(2, 4))
    tensor_b = push!(a, b_inds, rand(2, 3))
    b = copy(a)
    @test length(a) == length(b)
    @test keys(a) == keys(b) # test tensor symbols are the same.
    delete!(a, tensor_a)
    @test length(a) != length(b)

    # Test TN push kwargs
    a = TensorNetwork()
    tensor_a = push!(a, a_inds, rand(2, 4); tid = :t1)
    @test haskey(a, :t1)
end

@testset "Test TensorNetworkCircuit struct and interface functions" begin
    # create empty tensor network
    tnc = TensorNetworkCircuit(2)

    @test qubits(tnc) == 2
    @test length(tnc) == 0

    # add single qubit gate
    push!(tnc, [1], rand(2, 2))
    @test length(tnc) == 1

    # add two qubit gate
    push!(tnc, [1, 2], rand(4, 4), decompose=false)
    @test length(tnc) == 2

    # adding input
    add_input!(tnc, "01")
    @test length(tnc) == 4
    @test tensor_data(tnc, input_tensors(tnc)[1]) == [1., 0.]
    @test tensor_data(tnc, input_tensors(tnc)[2]) == [0., 1.]

    # adding output
    add_output!(tnc, "+-")
    @test length(tnc) == 6
    @test tensor_data(tnc, output_tensors(tnc)[1]) == [1., 1.]/sqrt(2)
    @test tensor_data(tnc, output_tensors(tnc)[2]) == [1., -1.]/sqrt(2)

    # test Base.copy on tnc
    tnc2 = copy(tnc)
    @test tensor_data(tnc2, output_tensors(tnc2)[1]) == [1., 1.]/sqrt(2)
    @test tensor_data(tnc2, output_tensors(tnc2)[2]) == [1., -1.]/sqrt(2)
    @test length(tnc) == length(tnc2)
end

@testset "Test circuit to Tensor Network Circuit conversion" begin
    # check tensornetwork size when no input or output
    tnc = create_test_tnc(no_input=true, no_output=true, decompose=false)
    @test qubits(tnc) == 3
    @test length(tnc) == 3
    # make sure there are gates on all qubits as expected
    @test all(tnc.input_indices .!= tnc.output_indices)

    tnc = create_test_tnc(no_input=true, no_output=true, decompose=true)
    @test qubits(tnc) == 3
    @test length(tnc) == 5
    # make sure there are gates on all qubits as expected
    @test all(tnc.input_indices .!= tnc.output_indices)

    # convert again adding input
    tnc = create_test_tnc(no_input=false, no_output=true, decompose=false)
    @test length(tnc) == 6
end

@testset "Test simple circuit contraction to verify conversion to circuit working" begin

    # we add input but no output to get full output vector
    tnc = create_test_tnc(no_input=false, no_output=true)

    output = simple_contraction(tnc)
    ref = zeros(8)
    ref[[1,8]] .= 1/sqrt(2)
    @test all(output .≈ ref)

    tnc =  create_test_tnc(no_input=false, no_output=true, decompose=false)

    output = simple_contraction(tnc)
    ref = zeros(8)
    ref[[1,8]] .= 1/sqrt(2)
    @test all(output .≈ ref)
end


@testset "Test mock tensors" begin
    # create a mock tensor and check dimension reported correctly
    dim = [2 << 20, 2<< 20]
    a_store = MockTensor(dim)
    @test length(a_store) == prod(dim)

    # create two tensors using mock tensor as storage and contract
    b_store = MockTensor([dim[1], 2, 4]);
    a_inds = Index.(dim)
    a = QXTensor(a_store, collect(a_inds))
    b = QXTensor(b_store, [a_inds[1], Index(2), Index(4)])
    c = contract_tensors(a, b)
    @test length(store(c)) == dim[2] * 2 * 4
end

@testset "Test tensor decomnposition" begin
    # prepare the circuit.
    tnc =  create_test_tnc(no_input=false, no_output=false, decompose=false)
    @assert length(tnc.tn.tensor_map) == 9

    # Find a tensor with four indices to decompose.
    t_id = :_
    for id in keys(tnc.tn.tensor_map)
        if length(inds(tnc.tn.tensor_map[id])) == 4
            t_id = id
            break
        end
    end
    @assert length(inds(tnc.tn.tensor_map[t_id])) == 4
    left_inds = collect(inds(tnc.tn.tensor_map[t_id]))
    left_inds = left_inds[1:2]

    # test svd
    Uid, Sid, Vid = replace_with_svd!(tnc.tn, t_id, left_inds;
                                      maxdim=2,
                                      cutoff=1e-13)
    @test length(tnc.tn.tensor_map) == 9 + 2

    SVid = contract_pair!(tnc.tn, Sid, Vid)
    USVid = contract_pair!(tnc.tn, Uid, SVid)
    @assert length(tnc.tn.tensor_map) == 9

    Uid, Vid = decompose_tensor!(tnc, USVid, left_inds;
                                        maxdim=2,
                                        cutoff=1e-13)
    @test length(tnc.tn.tensor_map) == 9 + 1
end

@testset "Test hyperedge detection" begin
    # prepare the circuit.
    tnc = TensorNetworkCircuit(3)
    push!(tnc, [1], QXTns.Gates.h(); decompose=false)
    push!(tnc, [2], QXTns.Gates.h(); decompose=false)
    push!(tnc, [3], QXTns.Gates.h(); decompose=false)
    push!(tnc, [1], QXTns.Gates.h(); decompose=false)
    push!(tnc, [2], QXTns.Gates.h(); decompose=false)
    push!(tnc, [3], QXTns.Gates.h(); decompose=false)
    @assert length(tnc.tn.bond_map) == 9

    # For a tn with no diagonal tensors, each hyperedge consists of a single edge.
    hyperedges = get_hyperedges(tnc)
    @test Set(hyperedges) == Set(values(tnc.tn.bond_map))

    # Check if there are exactly 6 hyperedges found in the GHZ circuit, with 2 hyperedges
    # containing 4 tensors and 4 hyperedges containing 2 tensors.
    tnc =  create_test_tnc(no_input=false, no_output=false, decompose=true)
    hyperedges = get_hyperedges(tnc)
    @test length(hyperedges) == 6
    @test QXTns.counter(length.(hyperedges)) == Dict(4=>2, 2=>4)
end

@testset "Test disable hyperindices" begin
    ai = [Index(2) for _ in 1:4]
    ci = [Index(2) for _ in 1:4]
    bi = [ai[3], ai[4], ci[1], ci[2]]

    a = QXTensor(ai, [[1,3], [2,4]])
    b = QXTensor(bi, [[1,3], [2,4]])
    c = QXTensor(ci, [[1,3], [2,4]])

    tn = TensorNetwork([a, b, c])
    @test all(map(x -> length(hyperindices(x)) > 0, tn))
    disable_hyperindices!(tn)
    @test all(map(x -> length(hyperindices(x)) == 0, tn))

    tn = TensorNetwork()
    t = QXTensor(Diagonal(ones(4)), [Index(4), Index(4)])
    sym = push!(tn, t)
    size(tensor_data(tn, sym)) == (4,4)
    size(tensor_data(tn, sym, consider_hyperindices=true)) == (4,)
    disable_hyperindices!(tn)
    size(tensor_data(tn, sym, consider_hyperindices=true)) == (4,4)
end

@testset "Test disable hyperindices" begin
    ai = [Index(2) for _ in 1:4]
    bi = [ai[3], ai[4], Index(2), Index(2)]

    a = QXTensor(ai, [[2,4]])
    b = QXTensor(bi, [[1,3], [2,4]])
    tn = TensorNetwork([a, b])
    # look at index which is not connected
    @test length(setdiff(find_connected_indices(tn, ai[1]), [ai[1]])) == 0
    # look at index connected to two others
    @test length(setdiff(find_connected_indices(tn, ai[2]), [ai[2], ai[4], bi[4]])) == 0
    # look at index connected to one other
    @test length(setdiff(find_connected_indices(tn, ai[3]), [ai[3], bi[3]])) == 0

    # look at case of global connection of hyper indices
    ai = [Index(2) for _ in 1:4]
    bi = [ai[3], ai[4], Index(2), Index(2)]

    a = QXTensor(ai, [[1,3], [2,4]])
    b = QXTensor(bi, [[1,2], [3,4]])
    tn = TensorNetwork([a, b])
    # now ai[1] and ai[2] shoudl be connected the indices in b are related there
    group = find_connected_indices(tn, ai[1])
    @test ai[2] ∈ group
end