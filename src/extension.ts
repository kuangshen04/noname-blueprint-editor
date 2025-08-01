import iframeHtml from "@/iframe.html?raw";
const path = "../../noname.js";
const { lib, game, ui, get, ai, _status } = await import(path);

export const type = "extension";
export default function () {
    return {
        name: "Blockly测试扩展",
        editable:false,
        arenaReady: function () {},
        content: function (config: any, pack: any) {},
        prepare: function () {},
        precontent: function () {
            let map: Record<string, any> = {};
            game.getDB("data", "blockly").then((data: Record<string, any>) => {
                if (!data) return;
                Object.assign(map, data);
            });
            const createEditor = async function (container: HTMLDivElement, name: string, saveInput: (view:{state:{doc:string}}) => void): Promise<any> {

                // 在editorpage中添加功能按钮等
                const editorpage = ui.create.div(container) as HTMLDivElement;
                editorpage.addEventListener("keydown", function (e) {
                    e.stopPropagation();
                });
                editorpage.addEventListener("keyup", function (e) {
                    e.stopPropagation();
                });

                const discardConfig = ui.create.div(".editbutton", "取消", editorpage, () => {
                    ui.window.classList.remove("shortcutpaused");
                    ui.window.classList.remove("systempaused");
                    //@ts-ignore
                    container.delete();
                });

                const saveConfig = ui.create.div(".editbutton", "保存", editorpage, () => {
                    //@ts-ignore
                    saveInput(view);
                });

                container.style.fontSize = Number((lib.config.codeMirror_fontSize || "16px").slice(0, -2)) / game.documentZoom + "px";

                const editor = ui.create.div(editorpage) as HTMLDivElement;

                const view = document.createElement("iframe");
                view.id = "blockly";
                view.style.display = "block";
                view.style.width = "100%";
                view.style.height = "100%";
                view.srcdoc = iframeHtml;
                view.onload = function () {
                    (view.contentWindow as any).codename = name;
                    (view.contentWindow as any).loadCode(map[name]);
                }

                editor.appendChild(view);

                Object.defineProperty(view, "state", {
                    get(){
                        console.log("保存", name);
                        map[name] = JSON.stringify((view.contentWindow as any)?.getSerializedResult(name));
                        game.putDB("data", "blockly", map);
                        return {doc:(view.contentWindow as any)?.getCode(name)};
                    }
                });
                return view;
            }


            const originalEditor = ui.create.editor2;
            ui.create.editor2 = async function (container: HTMLDivElement, config: {
                value: string;
                language: string;
                saveInput: (view:{state:{doc:string}}) => void;
            }) {
                let {
                    value,
                    language,
                    saveInput
                } = config;

                value = value.trim();
                // let reference = (Array.from(document.querySelectorAll(".menu-buttons:not(.hidden) .new_character select")) as HTMLInputElement[]).filter(i=> i.style.display !== "none").at(-1)?.value;
                let name = (document.querySelector(".menu-buttons:not(.hidden) input.new_name") as HTMLInputElement | undefined)?.value?.split("|")[0] || "";
                if (value.startsWith("card") && (map[name] || !lib.card[name])) {
                    console.log("card", name);
                    return originalEditor.apply(this, arguments);
                }
                else if (value.startsWith("skill") && (map[name] || !lib.skill[name])) {
                    console.log("skill", name);
                    return createEditor(container, name, saveInput);
                }
                console.log("使用CodeMirror编辑器", value);
                return originalEditor.apply(this, arguments);
            }
        },
        config: {},
        help: {},
        package: {
            character: {
                character: {},
                translate: {},
            },
            card: {
                card: {},
                translate: {},
                list: [],
            },
            skill: {
                skill: {},
                translate: {},
            },
            intro: [
                "当前版本为测试版，仅提供blockly代码编辑的示例，距离成品还有一段距离。",
                "由于本体extension menu的问题，以下提到的绝大部分功能需要改动本体。",
                "目前仅支持新建非引用技能，在打开编辑器前请务必填写完技能名称，否则在保存时会出现名称不匹配。",
                "引用技能将不可使用。",
                "持久化还没做，编辑完的blockly代码暂时保存在indexDB中。"
            ].join("\n"),
            author: "狂神",
            diskURL: "",
            forumURL: "",
            version: "0.0",
        },
        files: { character: [], card: [], skill: [], audio: [] },
        connect: false,
    };
}
