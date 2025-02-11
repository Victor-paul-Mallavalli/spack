import { FaRegComment, FaRegHeart, FaRegBookmark, FaTrash, FaShare } from "react-icons/fa"; // Changed here


<div className='flex gap-1 items-center group cursor-pointer'>
	<FaShare className='w-6 h-6 text-slate-500 group-hover:text-green-500' />
	<span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
</div>
import { BiShareAlt } from "react-icons/bi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";

const Post = ({ post }) => {
	const [comment, setComment] = useState("");
	const [isImageModalOpen, setImageModalOpen] = useState(false);
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();
	const postOwner = post.user;
	const isLiked = post.likes.includes(authUser._id);
	const isMyPost = authUser._id === post.user._id;
	const formattedDate = formatPostDate(post.createdAt);

	const deletePostMutation = useMutation({
		mutationFn: async () => {
			const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
		onSuccess: () => {
			toast.success("Post deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const likePostMutation = useMutation({
		mutationFn: async () => {
			const res = await fetch(`/api/posts/like/${post._id}`, { method: "POST" });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
		onSuccess: (updatedLikes) => {
			toast.success("Liked successfully");
			queryClient.setQueryData(["posts"], (oldData) => {
				return oldData.map((p) => (p._id === post._id ? { ...p, likes: updatedLikes } : p));
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const commentPostMutation = useMutation({
		mutationFn: async () => {
			const res = await fetch(`/api/posts/comment/${post._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text: comment }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
		onSuccess: () => {
			toast.success("Comment posted successfully");
			setComment("");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleDeletePost = () => deletePostMutation.mutate();

	const handlePostComment = (e) => {
		e.preventDefault();
		if (commentPostMutation.isLoading) return;
		commentPostMutation.mutate();
	};

	const handleLikePost = () => {
		if (likePostMutation.isLoading) return;
		likePostMutation.mutate();
	};

	const handleImageClick = () => setImageModalOpen(true);
	const handleCloseModal = () => setImageModalOpen(false);

	return (
		<>
			<div className='flex gap-2 items-start p-4 border-b border-gray-700'>
				<div className="avatar">
					<Link to={`/profile/${postOwner.username}`} className="w-10 h-10 rounded-full overflow-hidden">
						<img 
							src={postOwner.profileImg || "/avatar-placeholder.png"} 
							alt="Profile" 
							className="w-full h-full object-cover rounded-full" 
						/>
					</Link>
				</div>

				<div className='flex flex-col flex-1'>
					<div className='flex gap-2 items-center'>
						<Link to={`/profile/${postOwner.username}`} className='font-bold'>
							{postOwner.fullName}
						</Link>
						<span className='text-gray-700 flex gap-1 text-sm'>
							<Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
							<span>·</span>
							<span>{formattedDate}</span>
						</span>
						{isMyPost && (
							<span className='flex justify-end flex-1'>
								{!deletePostMutation.isLoading ? (
									<FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />
								) : (
									<LoadingSpinner size='sm' />
								)}
							</span>
						)}
					</div>
					<div className='flex flex-col gap-3 overflow-hidden'>
						<span>{post.text}</span>
						{post.img && (
							<img
								src={post.img}
								className='h-80 object-contain rounded-lg border border-gray-700 cursor-pointer'
								alt='Post'
								onClick={handleImageClick}
							/>
						)}
					</div>
					<div className='flex justify-between mt-3'>
						<div className='flex gap-4 items-center w-2/3 justify-between'>
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
							>
								<FaRegComment className='w-4 h-4 text-slate-500 group-hover:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{post.comments.length}
								</span>
							</div>
							<dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
								<div className='modal-box rounded border border-gray-600'>
									<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{post.comments.length === 0 ? (
											<p className='text-sm text-slate-500'>
												No comments yet 🤔 Be the first one 😉
											</p>
										) : (
											post.comments.map((comment) => (
												<div key={comment._id} className='flex gap-2 items-start'>
													<div className='avatar'>
														<div className='w-8 rounded-full'>
															<img
																src={comment.user.profileImg || "/avatar-placeholder.png"}
																alt='Commenter'
															/>
														</div>
													</div>
													<div className='flex flex-col'>
														<div className='flex items-center gap-1'>
															<span className='font-bold'>{comment.user.fullName}</span>
															<span className='text-gray-700 text-sm'>
																@{comment.user.username}
															</span>
														</div>
														<div className='text-sm'>{comment.text}</div>
													</div>
												</div>
											))
										)}
									</div>
									<form
										className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
										onSubmit={handlePostComment}
									>
										<textarea
											className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>
										<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
											{commentPostMutation.isLoading ? <LoadingSpinner size='md' /> : "Post"}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>
							<div className='flex gap-1 items-center group cursor-pointer'>
								<FaShare className='w-4 h-4  text-slate-500 group-hover:text-green-500' /> {/* Adjusted size */}
								<span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
							</div>


							<div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
								{likePostMutation.isLoading && <LoadingSpinner size='sm' />}
								{!isLiked && !likePostMutation.isLoading && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked && !likePostMutation.isLoading && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500' />
								)}
								<span
									className={`text-sm group-hover:text-pink-500 ${
										isLiked ? "text-pink-500" : "text-slate-500"
									}`}
								>
									{post.likes.length}
								</span>
							</div>
						</div>
						<div className='flex w-1/3 justify-end gap-2 items-center'>
							<FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
						</div>
					</div>
				</div>
			</div>

			{isImageModalOpen && (
				<dialog className="modal border-none outline-none" open>
					<div className="modal-box relative flex w-full max-w-4xl">
						<button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={handleCloseModal}>
							✕
						</button>

						{/* Left Side: Profile Info and Image */}
						<div className="flex flex-col w-1/2">
							{/* Profile Information */}
							<div className="flex gap-2 items-center mb-2">
								<div className="avatar">
									<Link to={`/profile/${postOwner.username}`} className="w-10 h-10 rounded-full overflow-hidden">
										<img 
											src={postOwner.profileImg || "/avatar-placeholder.png"} 
											alt="Profile" 
											className="w-full h-full object-cover rounded-full" 
										/>
									</Link>
								</div>

								<div className="flex flex-col">
									<span className="font-bold">{postOwner.fullName}</span>
									<span className="text-xs text-gray-500">@{postOwner.username}</span>
								</div>

								{/* Delete Icon for Owner */}
								{isMyPost && (
									<span className="flex justify-end flex-1">
										{!deletePostMutation.isLoading ? (
											<FaTrash className="cursor-pointer hover:text-red-500" onClick={handleDeletePost} />
										) : (
											<LoadingSpinner size="sm" />
										)}
									</span>
								)}
							</div>

							{/* Image */}
							<img src={post.img} className="w-full h-auto rounded-md border border-gray-700 max-h-[600px] object-cover" alt="Post" />

							{/* Like Button */}
							<div className="flex gap-1 items-center group mt-4" onClick={handleLikePost}>
								{likePostMutation.isLoading && <LoadingSpinner size='sm' />}
								{!isLiked && !likePostMutation.isLoading && (
									<FaRegHeart className='w-6 h-6 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked && !likePostMutation.isLoading && (
									<FaRegHeart className='w-6 h-6 cursor-pointer text-pink-500' />
								)}
								<span className={`text-md group-hover:text-pink-500 ${isLiked ? "text-pink-500" : "text-slate-500"}`}>
									{post.likes.length}
								</span>
							</div>
						</div>

						{/* Right Side: Comments Section */}
						<div className="flex-1 flex flex-col px-4 mt-4">
							<h3 className="font-bold text-lg mb-4">COMMENTS</h3>
							<div className="popup-comments flex flex-col gap-3 max-h-60 overflow-auto">
								{post.comments.length === 0 ? (
									<p className="text-sm text-slate-500">
										No comments yet 🤔 Be the first one 😉
									</p>
								) : (
									post.comments.map((comment) => (
										<div key={comment._id} className="flex gap-2 items-start">
											<div className="avatar">
												<div className="w-8 rounded-full">
													<img
														src={comment.user.profileImg || "/avatar-placeholder.png"}
														alt="Commenter"
													/>
												</div>
											</div>
											<div className="flex flex-col">
												<div className="flex items-center gap-1">
													<span className="font-bold">{comment.user.fullName}</span>
													<span className="text-gray-700 text-sm">
														@{comment.user.username}
													</span>
												</div>
												<div className="text-sm">{comment.text}</div>
											</div>
										</div>
									))
								)}
							</div>

							{/* Comment Form */}
							<form
								className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
								onSubmit={handlePostComment}
							>
								<textarea
									className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800"
									placeholder="Add a comment..."
									value={comment}
									onChange={(e) => setComment(e.target.value)}
								/>
								<button className="btn btn-primary rounded-full btn-sm text-white px-4">
									{commentPostMutation.isLoading ? <LoadingSpinner size="md" /> : "Post"}
								</button>
							</form>
						</div>
					</div>
				</dialog>
			)}
		</>
	);
};

export default Post;
