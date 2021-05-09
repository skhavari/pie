import { green, cyan, red, yellow } from 'https://deno.land/std@0.53.0/fmt/colors.ts';
import { format } from 'https://deno.land/std/datetime/mod.ts';
import { Middleware } from 'https://deno.land/x/oak/mod.ts';

/**
 *
 * get a fn that can color console output appropriately for the given status code
 *
 * @param status - http status code
 * @returns fn that can color console output appropriately for the given status code
 */
const colorForStatus = (status: number) => {
    const colors = [red, red, green, cyan, yellow, red];
    const idx = Math.max(Math.min(Math.floor(status / 100), colors.length - 1), 0);
    return colors[idx];
};

/**
 *
 * middleware that will log request / response info to the console
 *
 */
const logger: Middleware = async ({ request, response }, next) => {
    await next();
    const status = response.status;
    const fDate = format(new Date(Date.now()), 'yyyyddMM hh:mm:ss.SSS');
    const logStr = `[${fDate}] ${request.method} ${request.url.pathname} ${status}`;
    console.log(`${colorForStatus(status)(logStr)}`);
};

export default logger;
