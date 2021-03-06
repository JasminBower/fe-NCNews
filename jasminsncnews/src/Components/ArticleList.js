import React, { Component } from "react";
import * as api from "../utils/api";
import Loading from "./Loading";
import Articles from "./Article";
import SortArticles from "./SortArticles";
import DisplayError from "./DisplayError";

class ArticleList extends Component {
	state = {
		articles: [],
		isLoading: true,
		hasError: null,
	};

	componentDidMount() {
		this.fetchArticles();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.topic !== this.props.topic) {
			this.fetchArticles();
		}
	}

	fetchArticles = (sort_by, order) => {
		api
			.getArticles(this.props.topic, sort_by, order)
			.then((articles) => {
				this.setState({ articles, isLoading: false });
			})
			.catch((err) => {
				const { status, data } = err.response;
				this.setState({
					hasError: {
						status: status,
						msg: data.msg,
					},
				});
			});
	};

	render() {
		const { articles, isLoading, hasError } = this.state;
		if (hasError)
			return <DisplayError status={hasError.status} msg={hasError.msg} />;
		if (isLoading) return <Loading />;

		return (
			<main>
				Sort articles by: <SortArticles fetchArticles={this.fetchArticles} />
				{articles.map((article) => {
					return <Articles key={article.article_id} {...article} />;
				})}
			</main>
		);
	}
}

export default ArticleList;
