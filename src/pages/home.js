import React from 'react'
import {MasonryPost, PostMasonry, PostGrid} from '../components/common' // if only refer to directory, would find index.js under that common directory
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
        post.author = 'Benson Tuan'
        post.description = "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. "
    })
}

const recentPost = [...trending, ...featured, ...featured]

mergeStyles(trending, trendingConfig)
mergeStyles(featured, featuredConfig)

const lastFeatured = featured.pop()

function Home() {
    return (
        <main>
            <section className="container  home">
                <div className="row">
                    <section className="featured-posts-container">
                        <PostMasonry posts={featured} columns={2} tagsOnTop={true}/>
                        <MasonryPost post={lastFeatured} tagsOnTop={true} />
                    </section>
                </div>
            </section>
            <section className="bg-white">
                <section className="container  home">
                    <div className="row">
                        <h1> Recent Posts </h1>
                        <PostGrid posts={recentPost}/>
                    </div>
                </section>
            </section>

            <section className="container  home">
                <div className="row">
                    <PostMasonry posts={trending} columns={3}/>
                </div>
            </section>
        </main>
    )
}
export default Home
