module.exports = [
"[turbopack-node]/transforms/postcss.ts?config=[project]/oiltrace-frontend/postcss.config.mjs { CONFIG => \"[project]/oiltrace-frontend/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/05h__1_9xsdu._.js",
  "chunks/[root-of-the-server]__1ra5_7d._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts?config=[project]/oiltrace-frontend/postcss.config.mjs { CONFIG => \"[project]/oiltrace-frontend/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];