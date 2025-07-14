import * as Blockly from "blockly/core";
import {JavascriptGenerator, javascriptGenerator} from "blockly/javascript";

type stringTree = { [name: string]: stringTree | null; }
export type JavascriptBlockGenerator = (block: Blockly.Block, generator: JavascriptGenerator) => ([string, number] | string | null)

export class JavascriptGeneratorManager {
    private static instance: JavascriptGeneratorManager | null = null;

    private codeGenerator: JavascriptGenerator = javascriptGenerator;

    private generators: Record<string, JavascriptBlockGenerator> = Object.create(null);

    public registerGenerator(
        name: string, generator: JavascriptBlockGenerator
    ): void {
        this.generators[name] = generator;
    }

    public registerGenerators(generators: Record<string, JavascriptBlockGenerator>): void {
        for (const [name, generator] of Object.entries(generators)) {
            this.registerGenerator(name, generator);
        }
    }

    public init() {
        const modules = import.meta.glob('@/generators/javascript/**/*.ts', { eager: true });

        Object.values(modules).forEach((mod: any) => {
            if (mod.forBlock) {
                this.registerGenerators(mod.forBlock);
            }
        });

        Object.assign(this.codeGenerator.forBlock, this.generators);
    }

    public static getInstance(): JavascriptGeneratorManager {
        if (JavascriptGeneratorManager.instance === null) {
            JavascriptGeneratorManager.instance = new JavascriptGeneratorManager();
        }
        return JavascriptGeneratorManager.instance;
    }
}
