import React from 'react'
import {MasonryPost} from '.'

function PostMasonry({posts, columns, tagOnTop}) {
    return (
        <section className="masonry" style={{gridTemplateColumns: `repeat(${columns}, minmax(275px, 1fr))`}}>
            { posts.map((post, index) => (
                <MasonryPost {...{post, index, tagOnTop, key: index}} />
            ))}
        </section>
    )
}

export default PostMasonry
