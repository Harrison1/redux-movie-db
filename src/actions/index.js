import apikey from "../config.json"

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'

export const selectSubreddit = subreddit => ({
    type: SELECT_SUBREDDIT,
    subreddit
})

export const invalidateSubreddit = subreddit => ({
    type: INVALIDATE_SUBREDDIT,
    subreddit
})

export const requestPosts = subreddit => ({
    type: REQUEST_POSTS,
    subreddit
})

export const receivePosts = (subreddit, json) => ({
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.results.map(child => child),
    receivedAt: Date.now()
})

const fetchPosts = subreddit => dispatch => {
    dispatch(requestPosts(subreddit))
    return fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apikey.tmdb}&language=en-US&page=1`)
        .then(response => response.json())
        .then(json => dispatch(receivePosts(subreddit, json)))
}

const shouldFetchPosts = (state, subreddit) => {
    const posts = state.postsBySubreddit[subreddit]
    if (!posts) {
        return true
    }
    if (posts.isFetching) {
        return false
    }
    return posts.didInvalidate
}
  
export const fetchPostsIfNeeded = subreddit => (dispatch, getState) => {
    if (shouldFetchPosts(getState(), subreddit)) {
        return dispatch(fetchPosts(subreddit))
    }
}