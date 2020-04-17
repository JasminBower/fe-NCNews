import React, { Component } from "react";

import * as api from "../utils/api";
import CommentForm from "./CommentForm";
import DeleteComment from "./DeleteComment";
import CommentVotes from "./CommentVotes";

class CommentList extends Component {
	state = {
		comments: [],
	};

	componentDidMount() {
		this.fetchComments();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.topic !== this.props.topic) {
			this.fetchComments();
		}
	}

	fetchComments = () => {
		api.getComments(this.props.article_id).then((comments) => {
			this.setState({ comments });
		});
	};

	addComment = (newComment) => {
		this.setState((currentState) => {
			return { comments: [newComment, ...currentState.comments] };
		});
	};

	removeComment = (comment_id) => {
		const updatedComments = this.state.comments.filter((comment) => {
			if (comment.comment_id !== comment_id) {
				return comment;
			}
		});
		this.setState({ comments: updatedComments });
	};

	patchVotes = (comment_id, vote) => {
		api.patchCommentVotes(comment_id, vote).then((comment) => {
			const updatedComments = this.state.comments.map((item) => {
				if (item.comment_id !== comment_id) {
					return item;
				}
				return comment;
			});

			this.setState({ comments: updatedComments });
		});
	};

	render() {
		const { comments } = this.state;

		return (
			<div>
				<CommentForm
					article_id={this.props.article_id}
					username={this.props.loggedInUser}
					addComment={this.addComment}
				/>
				<ul>
					{comments.map((comment) => {
						return (
							<li key={comment.comment_id}>
								<h1>{comment.body}</h1>
								<p>by: {comment.author}</p>
								{comment.author === this.props.loggedInUser && (
									<DeleteComment
										comment_id={comment.comment_id}
										removeComment={this.removeComment}
									/>
								)}
								<p>votes: {comment.votes}</p>
								{comment.author !== this.props.loggedInUser && (
									<CommentVotes
										comment_id={comment.comment_id}
										patchVotes={this.patchVotes}
									/>
								)}
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}

export default CommentList;