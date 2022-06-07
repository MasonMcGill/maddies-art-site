import del from "del";
import fs from "fs-extra";
import gulp from "gulp";
import glob from "glob";
import injectProcessEnv from "rollup-plugin-inject-process-env";
import { rollup } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import sharp from "sharp";
import sucrase from "@rollup/plugin-sucrase";
import frontMatter from "front-matter";
import { dirname, extname } from "path";
import { marked } from "marked";
import yaml from "js-yaml";

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
  gulp.watch("source/pages/**", buildPageModule);
  gulp.watch("source/ui/**", buildUiModule);
}

async function buildIndexPage() {
  // const sourceText = await fs.readFile("source/index.hbs", "utf-8");
  // const { attributes, body } = frontMatter(sourceText);
  // const fontNames = attributes?.fonts || [];
  // const fontDir = "node_moduels/@fontsource";
  // const fontDefs = await Promise.all(
  //   fontNames.map((n) => fs.readFile(`${fontDir}/${n}/index.css`, "utf-8"))
  // );
  // const fontDefsConcat = fontDefs.join(" ").replace("\n", " ");
  // const outputText = body.replace("{{fontDefinitions}}", fontDefsConcat);
  // await fs.writeFile("site/index.html", outputText);
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
  const pageTree = await readPageTree("source/pages/index.md");
  const pageTreeJson = `const pageTree = ${JSON.stringify(pageTree, null, 2)};`;
  await fs.writeFile("site/pages.js", pageTreeJson);
}

async function readPageTree(path) {
  const text = await fs.readFile(path, "utf-8");
  const { body, attributes } = frontMatter(text);
  const expandedAttributes = await resolveReferences(attributes, dirname(path));
  return { ...expandedAttributes, body: marked.parse(body) };
}

async function resolveReferences(value, cwd) {
  if (Array.isArray(value)) {
    return await Promise.all(value.map((e) => resolveReferences(e, cwd)));
  }

  if (typeof value === "object") {
    const result = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = await resolveReferences(v, cwd);
    }
    return result;
  }

  if (typeof value === "string") {
    const match = value.match(/^\$page\((.*)\)$/);
    return match === null ? value : await readPageTree(`${cwd}/${match[1]}`);
  }

  return value;
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
