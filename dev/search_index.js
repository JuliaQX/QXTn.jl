var documenterSearchIndex = {"docs":
[{"location":"data_structures/#Data-Structures","page":"Data Structures","title":"Data Structures","text":"","category":"section"},{"location":"data_structures/","page":"Data Structures","title":"Data Structures","text":"QXTn has data structures for representing tensors, tensor networks and tensor network circuits. Here we go through each and show examples and features.","category":"page"},{"location":"data_structures/#QXTensor","page":"Data Structures","title":"QXTensor","text":"","category":"section"},{"location":"data_structures/","page":"Data Structures","title":"Data Structures","text":"QXTensor","category":"page"},{"location":"data_structures/#QXTn.QXTensor","page":"Data Structures","title":"QXTn.QXTensor","text":"Datastructure representing tensors\n\n\n\n\n\n","category":"type"},{"location":"data_structures/#Tensor-Network","page":"Data Structures","title":"Tensor Network","text":"","category":"section"},{"location":"data_structures/","page":"Data Structures","title":"Data Structures","text":"TensorNetwork","category":"page"},{"location":"data_structures/#QXTn.TensorNetwork","page":"Data Structures","title":"QXTn.TensorNetwork","text":"Tensor network data-structure\n\n\n\n\n\n","category":"type"},{"location":"data_structures/#Tensor-Network-Circuit","page":"Data Structures","title":"Tensor Network Circuit","text":"","category":"section"},{"location":"data_structures/","page":"Data Structures","title":"Data Structures","text":"TensorNetworkCircuit","category":"page"},{"location":"data_structures/#QXTn.TensorNetworkCircuit","page":"Data Structures","title":"QXTn.TensorNetworkCircuit","text":"Tensor network circuit data-structure\n\n\n\n\n\n","category":"type"},{"location":"license/","page":"LICENSE","title":"LICENSE","text":"MIT License","category":"page"},{"location":"license/","page":"LICENSE","title":"LICENSE","text":"Copyright (c) 2021 QuantEx team","category":"page"},{"location":"license/","page":"LICENSE","title":"LICENSE","text":"Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:","category":"page"},{"location":"license/","page":"LICENSE","title":"LICENSE","text":"The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.","category":"page"},{"location":"license/","page":"LICENSE","title":"LICENSE","text":"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.","category":"page"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = QXTn","category":"page"},{"location":"#QXTn","page":"Home","title":"QXTn","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"QXTn is a Julia package with data structures and utilities for manipulating tensor networks. As well as generic tensor network data structure, it also contains specific data structures for handling tensor networks derived from quantum circuits. It was developed as part of the QuantEx project, one of the individual software projects of WP8 of PRACE 6IP.","category":"page"},{"location":"","page":"Home","title":"Home","text":"It uses some features from ITensors and NDTensors for representing tensors and indices and performing contractions.","category":"page"},{"location":"#Installation","page":"Home","title":"Installation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"QXTn is a Julia package and can be installed using Julia's inbuilt package manager from the Julia REPL using.","category":"page"},{"location":"","page":"Home","title":"Home","text":"import Pkg\nPkg.add(\"QXTn\")","category":"page"},{"location":"","page":"Home","title":"Home","text":"To ensure everything is working, the unittests can be run using","category":"page"},{"location":"","page":"Home","title":"Home","text":"import Pkg; Pkg.test()","category":"page"},{"location":"#Example-usage","page":"Home","title":"Example usage","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"An example of creating a simple tensor network and contracting.","category":"page"},{"location":"","page":"Home","title":"Home","text":"using QXTn\n\ntn = TensorNetwork()\n\na, b, c, d = Index(2), Index(3), Index(5), Index(4)\n\n# add a 2x3x5 rank tensor\npush!(tn, [a, b, c], rand(2, 3, 5))\n# add a 5x4 matrix\npush!(tn, [c, d], rand(5, 4))\n\n# contract network\nsimple_contraction!(tn)\n\n# number of tensors after contraction\n@show length(tn)\n\n# resulting tensor has dimensions should have dimensions 2x3x4\n@show size(first(tn))","category":"page"},{"location":"#Contributing","page":"Home","title":"Contributing","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Contributions from users are welcome and we encourage users to open issues and submit merge/pull requests for any problems or feature requests they have. The CONTRIBUTING.md on the top level of the source folder has further details of the contribution guidelines.","category":"page"},{"location":"#Building-documentation","page":"Home","title":"Building documentation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"QXTn.jl uses Documenter.jl to generate documentation. To build the documentation locally run the following from the root folder.","category":"page"},{"location":"","page":"Home","title":"Home","text":"The first time it is will be necessary to instantiate the environment to install dependencies","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia --project=docs/ -e 'using Pkg; Pkg.develop(PackageSpec(path=pwd())); Pkg.instantiate()'","category":"page"},{"location":"","page":"Home","title":"Home","text":"and then to build the documentation","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia --project=docs/ docs/make.jl","category":"page"},{"location":"","page":"Home","title":"Home","text":"The generated document will be in the docs/build folder. To serve these locally one can use the LiveServer package as","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia --project -e 'import Pkg; Pkg.add(\"LiveServer\");\njulia --project -e  'using LiveServer; serve(dir=\"docs/build\")'","category":"page"},{"location":"","page":"Home","title":"Home","text":"Or with python3 using from the docs/build folder using","category":"page"},{"location":"","page":"Home","title":"Home","text":"python3 -m http.server","category":"page"},{"location":"","page":"Home","title":"Home","text":"The generated documentation should now be viewable locally in a browser at http://localhost:8000.","category":"page"},{"location":"#API-Reference","page":"Home","title":"API Reference","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [QXTn]","category":"page"},{"location":"#QXTn.MockTensor","page":"Home","title":"QXTn.MockTensor","text":"Tensor store struct that just tracks tensor dimensions\n\n\n\n\n\n","category":"type"},{"location":"#QXTn.QXTensor","page":"Home","title":"QXTn.QXTensor","text":"QXTensor(indices::Array{<:Index, 1},\n         hyper_indices::Array{<:Array{Int64, 1}, 1},\n         storage::Union{Nothing, <: NDTensors.TensorStorage}=nothing)\n\nQXTensor constructor which creates a new instance of QXTensor with the given indices and hyper indices. If no storage data structure is given then MockTensor of that shape is added as the storage.\n\n\n\n\n\n","category":"type"},{"location":"#QXTn.QXTensor-Tuple{T} where T<:Number","page":"Home","title":"QXTn.QXTensor","text":"QXTensor(a::T) where T <: Number\n\nQXTensor constructor which creates a new instance of QXTensor corresponding to a scalar\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.QXTensor-Tuple{Vector{var\"#s16\"} where var\"#s16\"<:Index}","page":"Home","title":"QXTn.QXTensor","text":"QXTensor(indices::Array{<:Index, 1})\n\nQXTensor constructor to create an instance of QXTensor with the given indices and will use MockTensor for the data storage.\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.QXTensor-Union{Tuple{N}, Tuple{Elt}, Tuple{AbstractArray{Elt, N}, Vector{var\"#s11\"} where var\"#s11\"<:Index}} where {Elt, N}","page":"Home","title":"QXTn.QXTensor","text":"QXTensor(data::AbstractArray{Elt, N},\n         indices::Array{<:Index, 1};\n         diagonal_check::Bool=true) where {Elt, N}\n\nConstructor to create a QXTensor instance using the given data and indices. If diagonalcheck is true, it will automaticallly check which indices are hyper indices and record in the hyperindices field.\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.TensorNetwork-Tuple{Vector{var\"#s22\"} where var\"#s22\"<:QXTensor}","page":"Home","title":"QXTn.TensorNetwork","text":"TensorNetwork(array::Vector{<: QXTensor})\n\nOuter constructor to create a tensor network object from an array of ITensor objects.\n\n\n\n\n\n","category":"method"},{"location":"#Base.convert-Tuple{Type{ITensors.ITensor}, QXTensor}","page":"Home","title":"Base.convert","text":"Base.convert(::Type{ITensor}, t::QXTensor)\n\nOverloaded convert to enable conversion of a QXTensor to an ITensor. Note that doing this will mean that information about the hyper indices will be lost.\n\n\n\n\n\n","category":"method"},{"location":"#Base.convert-Union{Tuple{N}, Tuple{Type{QXTensor}, ITensors.ITensor{N}}} where N","page":"Home","title":"Base.convert","text":"Base.convert(::Type{QXTensor}, t::ITensor{N}) where N\n\nOverloaded convert to enable conversion of an ITensor to a QXTensor. Note that converting in this way means that hyper indices won't be identified.\n\n\n\n\n\n","category":"method"},{"location":"#Base.copy-Tuple{MockTensor}","page":"Home","title":"Base.copy","text":"Overload functions from base to make MockTensor usable\n\n\n\n\n\n","category":"method"},{"location":"#Base.delete!-Tuple{TensorNetwork, Symbol}","page":"Home","title":"Base.delete!","text":"delete!(tn::TensorNetwork, tensor_id::Symbol)\n\nFunction to remove a tensor from a tensor network.\n\n\n\n\n\n","category":"method"},{"location":"#Base.delete!-Tuple{TensorNetworkCircuit, Symbol}","page":"Home","title":"Base.delete!","text":"delete!(tnc::TensorNetworkCircuit, tensor_id::Symbol)\n\nFunction to remove a tensor from a tensor network circuit.\n\n\n\n\n\n","category":"method"},{"location":"#Base.merge-Tuple{TensorNetwork, TensorNetwork}","page":"Home","title":"Base.merge","text":"merge(a::TensorNetwork, b::TensorNetwork)\n\nJoin two networks together\n\n\n\n\n\n","category":"method"},{"location":"#Base.push!-Union{Tuple{N}, Tuple{TensorNetwork, QXTensor}} where N","page":"Home","title":"Base.push!","text":"push!(tn::TensorNetwork,\n      tensor::QXTensor;\n      tid::Union{Nothing, Symbol}=nothing) where {N}\n\nFunction to add a tensor to the tensor network.\n\nKeywords\n\ntid::Union{Nothing, Symbol}=nothing: the id for the new tensor in tn. An id is \n\ngenerated if one is not set.\n\n\n\n\n\n","category":"method"},{"location":"#Base.push!-Union{Tuple{N}, Tuple{T}, Tuple{TensorNetwork, Vector{var\"#s21\"} where var\"#s21\"<:Index, Array{T, N}}} where {T, N}","page":"Home","title":"Base.push!","text":"push!(tn::TensorNetwork,\n      indices::Vector{Index},\n      data::Array{T, N}\n      tid::Union{Nothing, Symbol}=nothing) where {T, N}\n\nFunction to add a tensor to the tensor network.\n\nKeywords\n\ntid::Union{Nothing, Symbol}=nothing: the id for the new tensor in tn. An id is \n\ngenerated if one is not set.\n\n\n\n\n\n","category":"method"},{"location":"#Base.push!-Union{Tuple{T}, Tuple{TensorNetworkCircuit, Vector{Int64}, Matrix{T}}} where T","page":"Home","title":"Base.push!","text":"push!(tnc::TensorNetworkCircuit,\n      qubits::Vector{Int64},\n      data::Array{T, 2}) where T\n\nFunction to add a gate to the tensor network circuit given the qubits it acts on and an array of the matrix elements\n\n\n\n\n\n","category":"method"},{"location":"#Base.show-Tuple{IO, MIME{Symbol(\"text/plain\")}, QXTensor}","page":"Home","title":"Base.show","text":"Custom show for QXTensors\n\n\n\n\n\n","category":"method"},{"location":"#Base.size-Tuple{QXTensor}","page":"Home","title":"Base.size","text":"Custom size function\n\n\n\n\n\n","category":"method"},{"location":"#NDTensors.inds-Tuple{QXTensor}","page":"Home","title":"NDTensors.inds","text":"Implement inds for QXTensor\n\n\n\n\n\n","category":"method"},{"location":"#NDTensors.store-Tuple{QXTensor}","page":"Home","title":"NDTensors.store","text":"Implement store for QXTensor\n\n\n\n\n\n","category":"method"},{"location":"#QXTn._contract_ncon_indices-Union{Tuple{N}, Tuple{M}, Tuple{ITensors.IndexSet{M, IndexT, DataT} where {IndexT<:Index, DataT<:Tuple}, ITensors.IndexSet{N, IndexT, DataT} where {IndexT<:Index, DataT<:Tuple}}} where {M, N}","page":"Home","title":"QXTn._contract_ncon_indices","text":"_contract_ncon_indices(A_inds::IndexSet{M}, B_inds::IndexSet{N}) where {M, N}\n\nFunction return indices in ncon format for contraction of tensors with given index sets. Returns two tuples for indices in each with convention that negative values are remaining indices and positive values are indices being contracted over.\n\nFor example if (1, -1), (-2, 1) is returned, this menas that the first index of tensor A A is contracted with the second index of  tensor B and the resulting tensor will have indices corresponding to the second index of the first tensor and first index of the second tensor.\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.add_input!","page":"Home","title":"QXTn.add_input!","text":"add_input!(tnc::TensorNetworkCircuit; input::Union{String, Nothing}=nothing)\n\nFunction to add input tensors to the circuit\n\n\n\n\n\n","category":"function"},{"location":"#QXTn.add_output!","page":"Home","title":"QXTn.add_output!","text":"add_output!(tnc::TensorNetworkCircuit; output::Union{String, Nothing}=nothing)\n\nFunction to add output tensors to the circuit\n\n\n\n\n\n","category":"function"},{"location":"#QXTn.contract_hyper_indices-Tuple{Vector{var\"#s21\"} where var\"#s21\"<:Index, Vector{var\"#s22\"} where var\"#s22\"<:(Vector{var\"#s23\"} where var\"#s23\"<:Index), Vector{var\"#s24\"} where var\"#s24\"<:Index, Vector{var\"#s25\"} where var\"#s25\"<:(Vector{var\"#s26\"} where var\"#s26\"<:Index)}","page":"Home","title":"QXTn.contract_hyper_indices","text":"contract_hyper_indices(a_indices::Array{<:Index, 1},\n                       a_hyper_indices::Array{<:Array{<:Index, 1}, 1},\n                       b_indices::Array{<:Index, 1},\n                       b_hyper_indices::Array{<:Array{<:Index, 1}, 1})\n\nThis function calculates the resulting groups of hyper indices after contracting tensors with the given groups of hyper indices.\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.contract_ncon_indices-Tuple{TensorNetwork, Symbol, Symbol}","page":"Home","title":"QXTn.contract_ncon_indices","text":"contract_ncon_indices(tn::TensorNetwork, A_sym::Symbol, B_sym)\n\nFunction return indices in ncon format for contraction of tensors with given symbols. Returns two tuples for indices in each with convention that negative values are remaining indices and positive values are indices being contracted over.\n\nFor example if (1, -1), (-2, 1) is returned, this menas that the first index of tensor A A is contracted with the second index of  tensor B and the resulting tensor will have indices corresponding to the second index of the first tensor and first index of the second tensor.\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.contract_pair!","page":"Home","title":"QXTn.contract_pair!","text":"contract_pair!(tn::TensorNetwork, A_id::Symbol, B_id::Symbol; mock::Bool=false)\n\nContract the tensors in 'tn' with ids 'Aid' and 'Bid'. If the mock flag is true then the new tensor will be a mock tensor with the right dimensions but without the actual data.\n\nThe resulting tensor is stored in tn under the symbol C_id if one is provided, otherwise a new id is created for it.\n\n\n\n\n\n","category":"function"},{"location":"#QXTn.contract_tensors-Tuple{QXTensor, QXTensor}","page":"Home","title":"QXTn.contract_tensors","text":"contract_tensors(A::QXTensor, B::QXTensor; mock::Bool=false)\n\nFunction to contract two QXTensors and return another QXTensor. If the mock flag is false or either of the input tensors use MockTensor then the storage for the final tensor will be of type MockTensor.\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.contract_tn!-Tuple{TensorNetwork, Vector{Tuple{Symbol, Symbol, Symbol}}}","page":"Home","title":"QXTn.contract_tn!","text":"contract_tn!(tn::TensorNetwork, plan)\n\nContract the indices of 'tn' according to 'plan'.\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.create_test_tnc-Tuple{}","page":"Home","title":"QXTn.create_test_tnc","text":"create_test_tnc(;input::Union{String, Nothing}=nothing,\n                output::Union{String, Nothing}=nothing,\n                no_input::Bool=false,\n                no_output::Bool=false,\n                kwargs...)\n\nCreate a tensor network circuit for a small example circuit, 3 qubit ghz preparation circuit in this case\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.decompose_gate","page":"Home","title":"QXTn.decompose_gate","text":"function decompose_gate!(gate_data::Array{<:Number, 4},\n                         threshold::AbstractFloat=1e-15)\n\nFunction to decompose a tensor into two smaller tensors\n\n\n\n\n\n","category":"function"},{"location":"#QXTn.decompose_tensor!-Tuple{TensorNetwork, Symbol, Vector{var\"#s21\"} where var\"#s21\"<:Index}","page":"Home","title":"QXTn.decompose_tensor!","text":"decompose_tensor!(tn::TensorNetwork,\n                  tensor_id::Symbol,\n                  left_indices::Array{<:Index, 1};\n                  contract_S_with::Symbol=:V,\n                  kwargs...)\n\nFunction to decompose a tensor in a tensor network using svd.\n\nKeywords\n\ncontract_S_with::Symbol=:V: the maxtrix which should absorb the matrix of singular values\nmaxdim::Int: the maximum number of singular values to keep.\nmindim::Int: the minimum number of singular values to keep.\ncutoff::Float64: set the desired truncation error of the SVD.\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.find_hyper_edges-Union{Tuple{AbstractArray{Elt, N}}, Tuple{N}, Tuple{Elt}} where {Elt, N}","page":"Home","title":"QXTn.find_hyper_edges","text":"function find_hyper_edges(A::AbstractArray{Elt, N}) where {Elt, N}\n\nFunction to identify hyper edges of tensors. Returns an array of tuples of indices of the original tensor which can be identified\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.get_hyperedges-Tuple{TensorNetwork}","page":"Home","title":"QXTn.get_hyperedges","text":"get_hyperedges(tn::TensorNetwork)::Array{Array{Symbol, 1}, 1}\n\nReturn an array of hyperedges in the given tensornetwork tn. \n\nHyperedges are represented as arrays of tensor symbols.\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.hyperindices-Tuple{QXTensor}","page":"Home","title":"QXTn.hyperindices","text":"hyperindices(t::QXTensor)\n\nFunction to get the hyper indices as an array of arrays of Indices\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.isdiagonal-Union{Tuple{AbstractMatrix{Elt}}, Tuple{Elt}} where Elt","page":"Home","title":"QXTn.isdiagonal","text":"isdiagonal(A::AbstractArray{Elt, 2}) where Elt\n\nFunction to check if the given matrix is diagonal\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.isdiagonal-Union{Tuple{N}, Tuple{Elt}, Tuple{AbstractArray{Elt, N}, Pair{Int64, Int64}}} where {Elt, N}","page":"Home","title":"QXTn.isdiagonal","text":"isdiagonal(A::AbstractArray{Elt, N}, Pair{Int64, Int64}) where {Elt, N}\n\nFunction to check if the given matrix is diagonal along given axes\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.mock_contract","page":"Home","title":"QXTn.mock_contract","text":"mock_contract(T1::NDTensors.Tensor,\n              labelsT1,\n              T2::NDTensors.Tensor,\n              labelsT2,\n              labelsR = NDTensors.contract_labels(labelsT1, labelsT2))\n\nOverloaded contract function from NDTensors which implements contraction for tensors using MockTensor objects as storage.\n\n\n\n\n\n","category":"function"},{"location":"#QXTn.neighbours-Tuple{TensorNetwork, Symbol}","page":"Home","title":"QXTn.neighbours","text":"neighbours(tn::TensorNetwork, tensor::Symbol)\n\nFunction get the symbols of the neighbouring tensors\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.push_input!-Union{Tuple{Elt}, Tuple{TensorNetworkCircuit, Vector{Elt}, Int64}} where Elt","page":"Home","title":"QXTn.push_input!","text":"push_input!(tnc::TensorNetworkCircuit, tensor::Array{Elt, 1}, pos::Int64) where Elt\n\nFunction to add a single input tensor to the tensor network circuit at the given position\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.push_output!-Union{Tuple{Elt}, Tuple{TensorNetworkCircuit, Vector{Elt}, Int64}} where Elt","page":"Home","title":"QXTn.push_output!","text":"push_output!(tnc::TensorNetworkCircuit, tensor::Array{Elt, 1}, pos::Int64) where Elt\n\nFunction to add a single output tensor to the tensor network circuit at the given position\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.reduce_tensor-Union{Tuple{N}, Tuple{Elt}, Tuple{AbstractArray{Elt, N}, Vector{Vector{Int64}}}} where {Elt, N}","page":"Home","title":"QXTn.reduce_tensor","text":"reduce_tensor(A::AbstractArray{Elt, N}, hyper_index_groups::Array{Int64, 1})\n\nFunction to reduce the dimension of the given tensor assuming the given hyper edge groups. For example a diagonal matrix will have a single hyper edge group with both indices [1, 2]\n\njulia> QXTn.reduce_tensor([[1, 0] [0, 2]], [[1, 2]])\n2-element Vector{Int64}:\n 1\n 2\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.replace_tensor_symbol!-Tuple{TensorNetwork, Symbol, Symbol}","page":"Home","title":"QXTn.replace_tensor_symbol!","text":"replace_tensor_symbol!(tn::TensorNetwork, orig_sym::Symbol, new_sym::Symbol)\n\nReplace the given symbol with the given new symbol\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.replace_with_svd!-Tuple{TensorNetwork, Symbol, Vector{var\"#s21\"} where var\"#s21\"<:Index}","page":"Home","title":"QXTn.replace_with_svd!","text":"replace_with_svd!(tn::TensorNetwork, \n                  tensor_id::Symbol,\n                  left_indices::Array{<:Index, 1};\n                  kwargs...)\n\nFunction to replace a tensor in a tensor network with its svd.\n\nThe indices contained in 'left_indices' are considered the row indices of the tensor when the svd is performed.\n\nKeywords\n\nmaxdim::Int: the maximum number of singular values to keep.\nmindim::Int: the minimum number of singular values to keep.\ncutoff::Float64: set the desired truncation error of the SVD.\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.simple_contraction!-Tuple{TensorNetwork}","page":"Home","title":"QXTn.simple_contraction!","text":"simple_contraction!(tn::TensorNetwork)\n\nFunction to perfrom a simple contraction, contracting all tensors in order. Only useful for very small networks for testing.\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.simple_contraction-Tuple{TensorNetwork}","page":"Home","title":"QXTn.simple_contraction","text":"simple_contraction(tn::TensorNetwork)\n\nFunction to perfrom a simple contraction, contracting all tensors in order. Only useful for very small networks for testing.\n\n\n\n\n\n","category":"method"},{"location":"#QXTn.tensor_data-Tuple{QXTensor}","page":"Home","title":"QXTn.tensor_data","text":"tensor_data(tensor::QXTensor; consider_hyperindices::Bool=false)\n\nGet the data associated with the given tensor. If the consider_hyperindices flag is true then only the first of the hyper indices are retained. For example for a 5 rank tensor where the 2nd and 4th indices form a group of hyper indices, with this option set to true would return a rank 4 tensor where the 2nd index\n\n\n\n\n\n","category":"method"}]
}
