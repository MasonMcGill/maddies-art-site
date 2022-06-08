import del from "del";
import fs from "fs-extra";
import gulp from "gulp";
import glob from "glob";
import injectProcessEnv from "rollup-plugin-inject-process-env";
import { rollup } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import sharp from "sharp";
import sucrase from "@rollup/plugin-sucrase";
import { extname } from "path";
import { marked } from "marked";
import yaml from "js-yaml";
import * as cheerio from "cheerio";

export async function build() {
  await del("site/**");
  await Promise.all([
    buildIndexPage(),
    buildImageDirectory(),
    buildFontDirectory(),
    buildPageModule(),
    buildUiModule(),
  ]);
}

export async function watch() {
  await build();
  gulp.watch("source/index.html", buildIndexPage);
  gulp.watch("source/images/**", buildImageDirectory);
  gulp.watch("node_modules/@fontsource/**", buildFontDirectory);
  gulp.watch("source/pages.md", buildPageModule);
  gulp.watch("source/ui/**", buildUiModule);
}

async function buildIndexPage() {
  await fs.copy("source/index.html", "site/index.html");
}

async function buildImageDirectory(subtree = "", variants = null) {
  const src = `source/images${subtree}`;

  if ((await fs.stat(src)).isDirectory()) {
    try {
      const variantFilePath = `${src}/variants.yaml`;
      const variantFileText = await fs.readFile(variantFilePath, "utf-8");
      variants = yaml.load(variantFileText);
    } catch {}

    await Promise.all(
      (await fs.readdir(src))
        .filter((e) => e !== "variants.yaml")
        .map((e) => buildImageDirectory(`${subtree}/${e}`, variants))
    );
  }
  //
  else if (variants !== null) {
    const image = sharp(src);
    await Promise.all(
      Object.entries(variants).map(async ([name, { minWidth, minHeight }]) => {
        const ext = extname(subtree);
        const dst = `site/images${subtree.slice(0, -ext.length)}-${name}${ext}`;
        const outputBuffer = await image
          .resize(minWidth, minHeight, { fit: "outside" })
          .jpeg()
          .toBuffer();
        await fs.outputFile(dst, outputBuffer);
      })
    );
  }
  //
  else {
    const dst = `site/images${subtree}`;
    await fs.copy(src, dst);
  }

  if (subtree === "") {
    buildImageSizeModule();
  }
}

async function buildImageSizeModule() {
  const imagePaths = glob.sync("**/*", { cwd: "site/images", nodir: true });
  const imageSizes = Object.fromEntries(
    await Promise.all(
      imagePaths.map(async (path) => {
        const { width, height } = await sharp(`site/images/${path}`).metadata();
        return [path, { width, height }];
      })
    )
  );
  await fs.outputFile(
    "site/images/image-sizes.js",
    `const imageSizes = ${JSON.stringify(imageSizes, null, 2)};`
  );
}

async function buildFontDirectory() {
  await fs.copy("node_modules/@fontsource", "site/fonts");
}

async function buildPageModule() {
  const fusedHtml = marked.parse(await fs.readFile("source/pages.md", "utf-8"));
  const $ = cheerio.load(fusedHtml);

  const pages = [];

  for (const element of $("body").children()) {
    if (element.tagName === "h1") {
      let [path, type] = $(element).text().split(/\s+/);
      type = type ? type.replace(/^\(|\)$/g, "") : null;
      pages.push({ path, type, body: "" });
      continue;
    }

    if (
      pages.length > 0 &&
      pages.at(-1).body === "" &&
      element.tagName === "pre" &&
      element.firstChild.tagName === "code"
    ) {
      Object.assign(pages.at(-1), yaml.load($(element.firstChild).text()));
      continue;
    }

    if (pages.length > 0) {
      pages.at(-1).body += $.html(element) + "\n";
    }
  }

  const moduleText = `const pages = ${JSON.stringify(pages, null, 2)};`;
  await fs.writeFile("site/pages.js", moduleText);
}

async function buildUiModule() {
  const rollupPlugins = [
    sucrase({ exclude: ["node_modules/**"], transforms: ["typescript"] }),
    resolve({ extensions: [".js", ".ts"] }),
    injectProcessEnv({ NODE_ENV: "production" }),
  ];
  const bundle = await rollup({
    input: "source/ui/main.ts",
    plugins: rollupPlugins,
  });
  await bundle.write({
    file: "site/ui.js",
    name: "ui",
    format: "iife",
    sourcemap: true,
  });
}
