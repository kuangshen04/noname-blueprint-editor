import { Plugin } from "vite";
import fs from "fs";
import path from "path";
// @ts-ignore
import archiver from "archiver";
import ignore from "ignore";

export default function zipSource(): Plugin {
	return {
		name: "zip-source-plugin",
		apply: "build",
		async buildEnd() {
			const rootDir = path.resolve(import.meta.dirname, "./");
			const outputPath = path.resolve(rootDir, "dist/source.zip");

			// 读取 .gitignore 并创建 ignore 实例
			const gitignorePath = path.resolve(rootDir, ".gitignore");
			const ig = ignore();
			if (fs.existsSync(gitignorePath)) {
				const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
				ig.add(gitignoreContent);
			}

			const output = fs.createWriteStream(outputPath);
			const archive = archiver("zip", { zlib: { level: 9 } });

			output.on("close", () => {
				console.log(`打包完成：${archive.pointer()} bytes`);
			});

			archive.on("error", (err: any) => {
				throw err;
			});

			archive.pipe(output);

			// 手动遍历所有文件并过滤（因为 glob 不会用 ignore）
			const walk = (dir: string, baseDir = ""): string[] => {
				const result: string[] = [];
				const files = fs.readdirSync(dir);
				for (const file of files) {
					const relPath = path.join(baseDir, file);
					const absPath = path.join(dir, file);
					const stat = fs.statSync(absPath);
					if (ig.ignores(relPath)) continue;
					if (stat.isDirectory()) {
						result.push(...walk(absPath, relPath));
					} else {
						result.push(relPath);
					}
				}
				return result;
			};

			const filesToInclude = walk(rootDir);

			for (const file of filesToInclude) {
				archive.file(path.join(rootDir, file), { name: file });
			}

			archive.finalize();
		},
	};
}
