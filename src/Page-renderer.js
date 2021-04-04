import React from 'react'
import { useRouteMatch } from 'react-router-dom'

const generatePage = page => {
    const component = () => require(`./pages/${page}`).default //default export of that required module

    try {
        return React.createElement(component())
    } catch (err) {
        console.warn(err)
        return React.createElement(() => 404)
    }
}

function PageRenderer() {
    const {
        params: { page }
    } = useRouteMatch()

    return generatePage(page)
}

export default PageRenderer
