import React from 'react'
import trending from '../assets/mocks/trending'
import {PostMasonry} from '../components/common' // if only refer to directory, would find index.js under that common directory

function Home() {
    return (
        <section className="container  home">
            <div className="row">
                <h2>Trending Posts</h2>
                <PostMasonry posts={trending} columns={3}/>
            </div>
        </section>
    )
}
export default Home
