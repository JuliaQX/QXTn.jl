using LinearAlgebra

"""
    function decompose_gate!(gate_data::Array{<:Number, 4},
                             threshold::AbstractFloat=1e-15)

Function to decompose a tensor into two smaller tensors
"""
function decompose_gate(gate_data::Array{<:Number, 4},
                        threshold::AbstractFloat=1e-15)
    left_positions = [1, 3]
    right_positions = [2, 4]
    dims = size(gate_data)
    left_dims = [dims[x] for x in left_positions]
    right_dims = [dims[x] for x in right_positions]

    A = permutedims(gate_data, vcat(left_positions, right_positions))
    A = reshape(A, Tuple([prod(left_dims), prod(right_dims)]))

    # Use SVD here but QR could also be used
    F = svd(A)

    # find number of singular values above the threshold
    chi = sum(F.S .> threshold)
    s = sqrt.(F.S[1:chi])

    # assume that singular values and basis of U and V matrices are sorted
    # in descending order of singular value
    B = reshape(F.U[:, 1:chi] * Diagonal(s), Tuple(vcat(left_dims, [chi,])))
    C = reshape(Diagonal(s) * F.Vt[1:chi, :], Tuple(vcat([chi,], right_dims)))

    return B, C
end

"""
    function find_hyper_edges(A::AbstractArray{Elt, N}) where {Elt, N}

Function to identify hyper edges of tensors. Returns an array of tuples of indices
of the original tensor which can be identified
"""
function find_hyper_edges(A::AbstractArray{Elt, N}) where {Elt, N}
    if N == 2
        if isdiagonal(A)
            return [[1, 2]]
        else
            return Array{Array{Int64, 1}, 1}()
        end
    elseif N > 2
        groups = Array{Array{Int64, 1}, 1}()
        for i in 1:N-1
            for j in i+1:N
                if isdiagonal(A, Pair(i, j))
                    # check if there is overlap iwth any existing groups
                    if any(x -> length(intersect(x, (i, j))) > 0, groups)
                        # groups with intersections
                        igroups = [x for x in groups if length(intersect(x, (i, j))) > 0]
                        # filter these from main groups list
                        filter!(x -> length(intersect(x, (i, j))) == 0, groups)
                        merged_group = sort(reduce(union, igroups, init=[i, j]))
                        push!(groups, merged_group)
                    else
                        push!(groups, [i, j])
                    end
                end
            end
        end
        return groups
    end
    Array{Array{Int64, 1}, 1}()
end

"""
    isdiagonal(A::AbstractArray{Elt, N}, Pair{Int64, Int64}) where {Elt, N}

Function to check if the given matrix is diagonal along given axes
"""
function isdiagonal(A::AbstractArray{Elt, N}, p::Pair{Int64, Int64}) where {Elt, N}
    po = collect(1:N)
    function exchange!(a, e1, e2)  a[e1], a[e2] = a[e2], a[e1] end
    exchange!(po, 1, p[1])
    exchange!(po, 2, p[2])
    A = permutedims(A, po)
    d = size(A)
    A = reshape(A, (d[1], d[2], prod(d[3:end])))
    all(x -> isdiagonal(A[:, :, x]), 1:prod(d[3:end]))
end

"""
    isdiagonal(A::AbstractArray{Elt, 2}) where Elt

Function to check if the given matrix is diagonal
"""
function isdiagonal(A::AbstractArray{Elt, 2}) where Elt
    if real(eltype(A)) <: Integer
        all([A[i, j] == 0 for i in 1:size(A)[1], j in 1:size(A)[2] if i != j])
    else
        all([abs(A[i, j]) < eps(real(eltype(A))) for i in 1:size(A)[1], j in 1:size(A)[2] if i != j])
    end
end

"""
    reduce_tensor(A::AbstractArray{Elt, N}, hyper_index_groups::Array{Int64, 1})

Function to reduce the dimension of the given tensor assuming the given hyper edge groups. For example a diagonal
matrix will have a single hyper edge group with both indices [1, 2]

# ```jldoctest
# julia> QXTn.reduce_tensor([[1, 0] [0, 2]], [[1, 2]])
# 2-element Vector{Int64}:
#  1
#  2
# ```
"""
function reduce_tensor(A::AbstractArray{Elt, N}, hyper_index_groups::Array{Array{Int64, 1}, 1}) where {Elt, N}
    tensor_dims = size(A)
    index_map = Dict{Int64, Int64}(x => x for x in 1:N)
    for group in hyper_index_groups
        @assert length(group) >= 2 "Not all hyper edge groups have minimum dimension 2"
        ref = group[1]
        for j in group[2:end]
            index_map[j] = ref
        end
    end
    remaining_dims = unique(sort(collect(values(index_map))))
    remaining_dim_sizes = [tensor_dims[x] for x in remaining_dims]

    # create array to store reduced tensor with correct dimensions
    inverse_index_map = Dict{Int64, Array{Int64, 1}}(x => Int64[] for x in remaining_dims)
    for (k, v) in pairs(index_map)
        push!(inverse_index_map[v], k)
    end
    function map_reduced_indices_to_full(reduced_index::Tuple)
        full_index_array = zeros(Int64, N)
        for (dim, val) in enumerate(reduced_index)
            full_dim = remaining_dims[dim]
            full_index_array[inverse_index_map[full_dim]] .= val
        end
        full_index_array
    end
    Ar = zeros(Elt, remaining_dim_sizes...)
    for i in CartesianIndices(Tuple(remaining_dim_sizes))
        Ar[i] = A[map_reduced_indices_to_full(Tuple(i))...]
    end
    Ar
end