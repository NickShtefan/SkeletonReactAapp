var pages = {};
    pages.home = {
        path: '/',
        body: '<p>1</p>',
        attributes: {title: 'React.js Starter Kit'}
    };
    pages.about = {
            path: '/about',
            body: '<p>2</p>',
            attributes:{title: 'About'}
        };
    pages.privacy = {
            path: '/privacy',
            body: '<p>3</p>',
            attributes: {title: 'Privacy Policy'}
        };
    pages.category = {
        path: '/category',
        body: '<p>4</p>',
        attributes: {title: 'category'}
    };
    pages.module = {
        path: '/module',
        body: '<p>5</p>',
        attributes: {title: 'module'}
    };
module.exports = pages;