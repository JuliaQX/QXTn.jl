using ITensors
using NDTensors
using LinearAlgebra

"""
Tensor data structure for representing tensors and keeping track of hyper indices.
"""

export QXTensor, Index, hyperindices, contract_tensors

"""Datastructure representing a tensor"""
struct QXTensor
    rank::Int64
    indices::Array{<:Index}
    hyper_indices::Array{Array{Int64, 1}, 1}
    storage::NDTensors.TensorStorage
end

"""Custom show for QXTensors"""
Base.show(io::IO, ::MIME"text/plain", t::QXTensor) = print(io, "QXTensor, rank: $(t.rank), dims: $(Tuple(dim.(t.indices))), storage: $(typeof(t.storage)), hyper_indices: $(t.hyper_indices)")
"""Custom size function"""
Base.size(a::QXTensor) = Tuple(dim.(a.indices))
"""Implement inds for QXTensor"""
ITensors.inds(a::QXTensor) = a.indices
"""Implement store for QXTensor"""
ITensors.store(a::QXTensor) = a.storage

"""
    QXTensor(a::T) where T <: Number 


QXTensor constructor which creates a new instance of QXTensor corresponding to a scalar
"""
function QXTensor(a::T) where T <: Number
    QXTensor(0, Array{Index, 1}(), Array{Array{Index, 1}, 1}(), NDTensors.Dense([a]))
end

"""
    QXTensor(indices::Array{<:Index, 1},
             hyper_indices::Array{<:Array{Int64, 1}, 1},
             storage::Union{Nothing, <: NDTensors.TensorStorage}=nothing)

QXTensor constructor which creates a new instance of QXTensor with the given indices
and hyper indices. If no storage data structure is given then MockTensor of that shape
is added as the storage.
"""
function QXTensor(indices::Array{<:Index, 1},
                  hyper_indices::Array{<:Array{Int64, 1}, 1},
                  storage::Union{Nothing, <: NDTensors.TensorStorage}=nothing)
    if storage === nothing
        storage = MockTensor(dim.(indices))
    end
    QXTensor(length(indices), indices, hyper_indices, storage)
end

"""
    QXTensor(indices::Array{<:Index, 1})

QXTensor constructor to create an instance of QXTensor with the given indices and 
will use MockTensor for the data storage.
"""
function QXTensor(indices::Array{<:Index, 1})
    QXTensor(indices, Array{Array{Int64, 1}, 1}())
end

"""
    QXTensor(data::AbstractArray{Elt, N}, 
             indices::Array{<:Index, 1}; 
             diagonal_check::Bool=true) where {Elt, N}

Constructor to create a QXTensor instance using the given data and indices. If
diagonal_check is true, it will automaticallly check which indices are hyper indices
and record in the hyper_indices field.
"""
function QXTensor(data::AbstractArray{Elt, N}, 
                  indices::Array{<:Index, 1}; 
                  diagonal_check::Bool=true) where {Elt, N}
    # if it is diagonal just expand to full dense format for now
    # if data isa NDTensors.Diag
    #     data = collect(Diagonal(data))
    # end
    # data = convert(Vector{Elt}, data)
    @assert prod(size(data)) == prod(dim.(indices)) "Product of index dimensions must match data dimension"
    if diagonal_check && !(data isa MockTensor)
        hyper_indices = find_hyper_edges(reshape(data, Tuple(dim.(indices))))
    else
        hyper_indices = Array{Array{Int64, 1}, 1}()
    end
    if !(data isa NDTensors.Dense) && !(data isa MockTensor)
        data = NDTensors.Dense(reshape(data, prod(size(data))))
    end
    QXTensor(indices, hyper_indices, data)
end

"""
    Base.convert(::Type{ITensor}, t::QXTensor)

Overloaded convert to enable conversion of a QXTensor to an ITensor. Note that doing this
will mean that information about the hyper indices will be lost.
"""
function Base.convert(::Type{ITensor}, t::QXTensor)
    ITensor(t.storage, IndexSet(t.indices))
end

"""
    Base.convert(::Type{QXTensor}, t::ITensor{N}) where N

Overloaded convert to enable conversion of an ITensor to a QXTensor. Note that converting
in this way means that hyper indices won't be identified.
"""
function Base.convert(::Type{QXTensor}, t::ITensor{N}) where N
    QXTensor(store(t), collect(inds(t)))
end


"""
    hyperindices(t::QXTensor)

Function to get the hyper indices as an array of arrays of Indices
"""
function hyperindices(t::QXTensor)
    hyper_indices = Array{Array{Index, 1}, 1}()
    for group in t.hyper_indices
        push!(hyper_indices, t.indices[group])
    end
    hyper_indices
end

"""
    contract_hyper_indices(a_indices::Array{<:Index, 1},
                           a_hyper_indices::Array{<:Array{<:Index, 1}, 1},
                           b_indices::Array{<:Index, 1},
                           b_hyper_indices::Array{<:Array{<:Index, 1}, 1})

This function calculates the resulting groups of hyper indices after contracting tensors with the given
groups of hyper indices.
"""
function contract_hyper_indices(a_indices::Array{<:Index, 1},
                                a_hyper_indices::Array{<:Array{<:Index, 1}, 1},
                                b_indices::Array{<:Index, 1},
                                b_hyper_indices::Array{<:Array{<:Index, 1}, 1})
    common_indices = intersect(a_indices, b_indices)    
    remaining_indices = setdiff(union(a_indices, b_indices), common_indices)
    # join hyper groups where there are overlaps. O(N^2) complexity but number of groups should be small
    final_groups = Array{Array{Index, 1}, 1}()
    b_found = zeros(Bool, length(b_hyper_indices))
    for (i, a_group) in enumerate(a_hyper_indices)
        for (j, b_group) in enumerate(b_hyper_indices)
            if length(intersect(a_group, b_group)) > 0
                b_found[j] = true        
                remaining_merged = setdiff(union(a_group, b_group), common_indices)
                if length(remaining_merged) > 1
                    push!(final_groups, remaining_merged)
                end
            end
        end
    end
    # add any groups in b that have not been added and are still present
    for i in findall(x -> !x, b_found)
        b_group = b_hyper_indices[i]
        if length(setdiff(b_group, common_indices)) > 1
            push!(final_groups, setdiff(b_group, common_indices))
        end
    end
    final_groups
end


"""
    contract_tensors(A::QXTensor, B::QXTensor; mock::Bool=false)

Function to contract two QXTensors and return another QXTensor. If the mock flag
is false or either of the input tensors use MockTensor then the storage for the final
tensor will be of type MockTensor.
"""
function contract_tensors(A::QXTensor, B::QXTensor; mock::Bool=false)
    (labelsA,labelsB) = ITensors.compute_contraction_labels(IndexSet(inds(A)),IndexSet(inds(B)))
    if mock || (store(A) isa MockTensor) || store(B) isa MockTensor
        CT = mock_contract(ITensors.tensor(store(A), inds(A)), labelsA, ITensors.tensor(store(B), inds(B)), labelsB)
    else
        CT = contract(ITensors.tensor(store(A), IndexSet(inds(A))), labelsA, ITensors.tensor(store(B), IndexSet(inds(B))), labelsB)
    end
    # TODO: cleanup this logic and possibly store the indices themselves rather than positions in the struct
    c_hyper_indices = contract_hyper_indices(inds(A), hyperindices(A), inds(B), hyperindices(B))
    c_indices = collect(inds(CT))
    c_hyper_indices_positions = convert(Array{Array{Int64, 1}, 1}, [findall(x -> x in y, c_indices) for y in c_hyper_indices])
    C = QXTensor(c_indices, c_hyper_indices_positions, store(CT))
    return C
end
