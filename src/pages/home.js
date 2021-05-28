import React from 'react'
import {MasonryPost, PostMasonry} from '../components/common' // if only refer to directory, would find index.js under that common directory
import trending from '../assets/mocks/trending'
import featured from '../assets/mocks/featured'

// config for each css grid (of posts), to merge the config w/ the posts obj
// Set grid-area for the 2nd post (index=1)
// The index 3 one in featuredConfig is pop() out and refered to by const lastFeatured
const trendingConfig = {
    1: {
        gridArea: '1 / 2 / 3 / 3'
    }
}

const featuredConfig = {
    0: {
        gridArea: '1 / 1 / 2 / 3',
        height: '300px'
    },
    1: {
        height: '300px'
    },
    3: {
        height: '630px',
        marginLeft: '30px',
        width: '630px'
    }
}

const mergeStyles = function (posts, config) {
    posts.forEach((post, index) => {
        post.style = config[index] // if config have that index ...
    })
}

mergeStyles(trending, trendingConfig)
mergeStyles(featured, featuredConfig)

const lastFeatured = featured.pop()

function Home() {
    return (
        <section className="container  home">
            <div className="row">
                <h1>Featured Posts</h1>
                <section className="featured-posts-container">
                    <PostMasonry posts={featured} columns={2} tagsOnTop={true}/>
                    <MasonryPost post={lastFeatured} tagsOnTop={true} />
                </section>
                <h1>Trending Posts</h1>
                <PostMasonry posts={trending} columns={3}/>
            </div>
        </section>
    )
}
export default Home
