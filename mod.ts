import { Application, Router, Middleware, RouterMiddleware } from 'https://deno.land/x/oak/mod.ts';
import logger from './logger.ts';
import * as path from 'https://deno.land/std/path/mod.ts';

const scriptURL = new URL(import.meta.url);
const STATIC_ROOT = path.join(path.dirname(scriptURL.pathname), 'static');
console.log(STATIC_ROOT);

export interface PieServerConfig {
    routeMap: Map<string, RouterMiddleware>;
    port: number;
}

/**
 *
 * middleware to return static files under ./static/
 *
 */
const serveStatic: Middleware = async (context, next) => {
    try {
        await context.send({ root: STATIC_ROOT, index: 'index.html' });
    } catch {
        await next();
    }
};

/**
 *
 * middleware to return ./static/404.html for 404's.
 * this should be the last middleware added to the chain.
 *
 */

const notFound: Middleware = async (context) => {
    if (context.response.status === 404) {
        await context.send({ root: STATIC_ROOT, path: '404.html' });
    }
};

/**
 * Instantiate, configure and return a new server
 *
 * @param config PieServerConfig to use
 * @returns a new oak Application
 */
export function newPieServer(config: PieServerConfig) {
    const app = new Application();

    // logging
    app.use(logger);

    // handlers
    const router = new Router();
    config.routeMap.forEach((handler, route) => router.get(route, handler));
    app.use(router.routes());
    app.use(router.allowedMethods());

    // serve static files
    app.use(serveStatic);

    // 404
    app.use(notFound);

    // start it
    app.listen({ port: config.port });
    return app;
}
