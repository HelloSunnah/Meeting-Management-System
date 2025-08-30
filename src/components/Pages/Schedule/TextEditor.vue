<template>
    <div class="tiptap-editor-wrapper">
        <!-- Toolbar -->
        <div v-if="editor" class="toolbar-container" id="toolbar-container">
            <!-- Text Formatting -->
            <!-- Headings -->
            <div class="toolbar-group">
                <select @change="setHeading($event)" class="toolbar-select">
                    <option value="paragraph">Paragraph</option>
                    <option value="heading1">Heading 1</option>
                    <option value="heading2">Heading 2</option>
                    <option value="heading3">Heading 3</option>
                    <option value="heading4">Heading 4</option>
                    <option value="heading5">Heading 5</option>
                    <option value="heading6">Heading 6</option>
                </select>
            </div>

            <div class="toolbar-group">
                <button type="button" @click="editor.chain().focus().toggleBold().run()"
                    :class="{ 'is-active': editor.isActive('bold') }" class="toolbar-btn" title="Bold">
                    <strong>B</strong>
                </button>
                <button type="button" @click="editor.chain().focus().toggleItalic().run()"
                    :class="{ 'is-active': editor.isActive('italic') }" class="toolbar-btn" title="Italic">
                    <em>I</em>
                </button>
                <button type="button" @click="editor.chain().focus().toggleUnderline().run()"
                    :class="{ 'is-active': editor.isActive('underline') }" class="toolbar-btn" title="Underline">
                    <u>U</u>
                </button>
                     <button type="button" @click="editor.chain().focus().toggleBulletList().run()"
                    :class="{ 'is-active': editor.isActive('bulletList') }" class="toolbar-btn" title="Bullet List">
                    • List
                </button>
                <button type="button" @click="editor.chain().focus().toggleOrderedList().run()"
                    :class="{ 'is-active': editor.isActive('orderedList') }" class="toolbar-btn" title="Numbered List">
                    1. List
                </button>
                <!-- <button type="button" @click="editor.chain().focus().toggleStrike().run()"
                    :class="{ 'is-active': editor.isActive('strike') }" class="toolbar-btn" title="Strikethrough">
                    <s>S</s>
                </button> -->
                <!-- <button type="button" @click="editor.chain().focus().toggleCode().run()"
                    :class="{ 'is-active': editor.isActive('code') }" class="toolbar-btn" title="Inline Code">
                    &lt;/&gt;
                </button> -->
            </div>



            <!-- Text Color & Highlight -->
            <div class="toolbar-group">
                <input type="color" @change="setTextColor($event)" class="color-picker" title="Text Color" />
                <input type="color" @change="setHighlightColor($event)" class="color-picker" title="Highlight Color" />
                <!-- <button type="button" @click="editor.chain().focus().unsetColor().run()" class="toolbar-btn"
                    title="Remove Color">
                    🎨
                </button> -->
            </div>

            <!-- Alignment -->
            <div class="toolbar-group">
                <button type="button" @click="editor.chain().focus().setTextAlign('left').run()"
                    :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }" class="toolbar-btn"
                    title="Align Left">
                    ⬅️
                </button>
                <button type="button" @click="editor.chain().focus().setTextAlign('center').run()"
                    :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }" class="toolbar-btn"
                    title="Align Center">
                    ↔️
                </button>
                <button type="button" @click="editor.chain().focus().setTextAlign('right').run()"
                    :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }" class="toolbar-btn"
                    title="Align Right">
                    ➡️
                </button>
                <!-- <button type="button" @click="editor.chain().focus().setTextAlign('justify').run()"
                    :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }" class="toolbar-btn"
                    title="Justify">
                    ↕️
                </button> -->
            </div>
 <!-- Clear Formatting -->
            <div class="toolbar-group">
                
                 <button type="button" @click="editor.chain().focus().undo().run()" class="toolbar-btn" title="Undo">
                    ↶ 
                </button>
                <button type="button" @click="editor.chain().focus().redo().run()" class="toolbar-btn" title="Redo">
                    ↷ 
                </button>
                <button type="button" @click="editor.chain().focus().clearNodes().unsetAllMarks().run()"
                    class="toolbar-btn" title="Clear Formatting">
                    🧹 
                </button>
            </div>
            <!-- Lists -->
            <!-- <div class="toolbar-group">
                <button type="button" @click="editor.chain().focus().toggleBulletList().run()"
                    :class="{ 'is-active': editor.isActive('bulletList') }" class="toolbar-btn" title="Bullet List">
                    • List
                </button>
                <button type="button" @click="editor.chain().focus().toggleOrderedList().run()"
                    :class="{ 'is-active': editor.isActive('orderedList') }" class="toolbar-btn" title="Numbered List">
                    1. List
                </button>
                <button type="button" @click="editor.chain().focus().toggleTaskList().run()"
                    :class="{ 'is-active': editor.isActive('taskList') }" class="toolbar-btn" title="Task List">
                    ☑️ Task
                </button>
            </div> -->

            <!-- Indentation -->
            <!-- <div class="toolbar-group">
                <button type="button" @click="editor.chain().focus().sinkListItem('listItem').run()" class="toolbar-btn"
                    title="Indent">
                    →
                </button>
                <button type="button" @click="editor.chain().focus().liftListItem('listItem').run()" class="toolbar-btn"
                    title="Outdent">
                    ←
                </button>
            </div> -->

            <!-- Special Elements -->
            <!-- <div class="toolbar-group">
                <button type="button" @click="editor.chain().focus().toggleBlockquote().run()"
                    :class="{ 'is-active': editor.isActive('blockquote') }" class="toolbar-btn" title="Quote">
                    " Quote
                </button>
                <button type="button" @click="editor.chain().focus().toggleCodeBlock().run()"
                    :class="{ 'is-active': editor.isActive('codeBlock') }" class="toolbar-btn" title="Code Block">
                    &lt;/&gt; Block
                </button>
                <button type="button" @click="editor.chain().focus().setHorizontalRule().run()" class="toolbar-btn"
                    title="Horizontal Rule">
                    ―――
                </button>
            </div> -->

            <!-- Links and Media -->
            <!-- <div class="toolbar-group">
                <button type="button" @click="addLink" :class="{ 'is-active': editor.isActive('link') }"
                    class="toolbar-btn" title="Add Link">
                    🔗 Link
                </button>
                <button type="button" @click="addImage" class="toolbar-btn" title="Add Image">
                    🖼️ Image
                </button>
                <button type="button" @click="addYouTube" class="toolbar-btn" title="Add YouTube Video">
                    📺 Video
                </button>
            </div> -->

            <!-- Table -->
            <!-- <div class="toolbar-group">
                <button type="button" @click="insertTable" class="toolbar-btn" title="Insert Table">
                    📊 Table
                </button>
                <button type="button" @click="editor.chain().focus().addColumnBefore().run()"
                    :disabled="!editor.isActive('table')" class="toolbar-btn" title="Add Column Before">
                    ← Col
                </button>
                <button type="button" @click="editor.chain().focus().addColumnAfter().run()"
                    :disabled="!editor.isActive('table')" class="toolbar-btn" title="Add Column After">
                    Col →
                </button>
                <button type="button" @click="editor.chain().focus().deleteColumn().run()"
                    :disabled="!editor.isActive('table')" class="toolbar-btn" title="Delete Column">
                    ❌ Col
                </button>
                <button type="button" @click="editor.chain().focus().addRowBefore().run()"
                    :disabled="!editor.isActive('table')" class="toolbar-btn" title="Add Row Before">
                    ↑ Row
                </button>
                <button type="button" @click="editor.chain().focus().addRowAfter().run()"
                    :disabled="!editor.isActive('table')" class="toolbar-btn" title="Add Row After">
                    ↓ Row
                </button>
                <button type="button" @click="editor.chain().focus().deleteRow().run()"
                    :disabled="!editor.isActive('table')" class="toolbar-btn" title="Delete Row">
                    ❌ Row
                </button>
                <button type="button" @click="editor.chain().focus().deleteTable().run()"
                    :disabled="!editor.isActive('table')" class="toolbar-btn" title="Delete Table">
                    ❌ Table
                </button>
            </div> -->

            <!-- History -->
            <!-- <div class="toolbar-group">
                <button type="button" @click="editor.chain().focus().undo().run()" class="toolbar-btn" title="Undo">
                    ↶ Undo
                </button>
                <button type="button" @click="editor.chain().focus().redo().run()" class="toolbar-btn" title="Redo">
                    ↷ Redo
                </button>
            </div> -->

           
        </div>

        <!-- Editor Content -->
        <div class="editor-container">
            <editor-content :editor="editor" class="editor-content" />
        </div>

        <!-- Footer with Statistics -->
        <div v-if="editor" class="editor-footer">
            <div class="editor-stats">
                <span>Characters: {{ getCharacterCount() }}</span>
                <span>Words: {{ getWordCount() }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import { StarterKit } from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Youtube } from '@tiptap/extension-youtube';

// Props
interface Props {
    modelValue: string;
    placeholder?: string;
    minHeight?: number;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    placeholder: 'Start typing...',
    minHeight: 200
});

// Emits
const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

TextAlign.configure({
  types: ['heading', 'paragraph'],
})
// Reactive references
const editor = ref<Editor | null>(null);

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
    if (editor.value && editor.value.getHTML() !== newValue) {
        editor.value.commands.setContent(newValue, false);
    }
});

// Initialize editor
onMounted(() => {
    editor.value = new Editor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'custom-image',
                },
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            CharacterCount,
            Youtube.configure({
                width: 640,
                height: 480,
                ccLanguage: 'en',
            }),
        ],
        content: props.modelValue,
        onUpdate: ({ editor }) => {
            emit('update:modelValue', editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'tiptap-content',
                style: `min-height: ${props.minHeight}px;`,
            },
        },
    });
});

// Cleanup
onBeforeUnmount(() => {
    if (editor.value) {
        editor.value.destroy();
    }
});

// Helper functions for character and word count
const getCharacterCount = (): number => {
    return editor.value?.storage.characterCount?.characters() || 0;
};

const getWordCount = (): number => {
    return editor.value?.storage.characterCount?.words() || 0;
};

// Toolbar methods
const setHeading = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const level = target.value;

    if (level === 'paragraph') {
        editor.value?.chain().focus().setParagraph().run();
    } else {
        const headingLevel = parseInt(level.replace('heading', '')) as 1 | 2 | 3 | 4 | 5 | 6;
        editor.value?.chain().focus().toggleHeading({ level: headingLevel }).run();
    }
};

const setTextColor = (event: Event) => {
    const target = event.target as HTMLInputElement;
    editor.value?.chain().focus().setColor(target.value).run();
};

const setHighlightColor = (event: Event) => {
    const target = event.target as HTMLInputElement;
    editor.value?.chain().focus().setHighlight({ color: target.value }).run();
};

// const addLink = () => {
//     const previousUrl = editor.value?.getAttributes('link').href;
//     const url = window.prompt('URL', previousUrl);

//     if (url === null) return;

//     if (url === '') {
//         editor.value?.chain().focus().extendMarkRange('link').unsetLink().run();
//         return;
//     }

//     editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
// };

const addImage = () => {
    const url = window.prompt('Image URL');

    if (url) {
        editor.value?.chain().focus().setImage({ src: url }).run();
    }
};

const addYouTube = () => {
    const url = window.prompt('YouTube URL');

    if (url) {
        editor.value?.commands.setYoutubeVideo({
            src: url,
        });
    }
};

const insertTable = () => {
    editor.value?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
};
</script>

<style scoped>
.tiptap-editor-wrapper {
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    overflow: hidden;
    background: white;
}

.toolbar-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px;
    background: #f8f9fa;
    border-bottom: 1px solid #e1e5e9;
   justify-content: center;
}

.toolbar-group {
    display: flex;
    gap: 4px;
    align-items: center;
    padding: 0 8px;
    border-right: 1px solid #dee2e6;
}

.toolbar-group:last-child {
    border-right: none;
}

.toolbar-btn {
    padding: 6px 12px;
    border: 1px solid #dee2e6;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    color: #495057;
    transition: all 0.2s;
    white-space: nowrap;
}

.toolbar-btn:hover {
    background: #e9ecef;
    border-color: #adb5bd;
}

.toolbar-btn.is-active {
    background: #007bff;
    color: white;
    border-color: #007bff;
}

.toolbar-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.toolbar-select {
    padding: 4px 8px;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    background: white;
    font-size: 12px;
    min-width: 100px;
}

.color-picker {
    width: 32px;
    height: 28px;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    cursor: pointer;
    background: none;
}

.editor-container {
    position: relative;
}

.editor-content {
    padding: 16px;
}

.editor-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background: #f8f9fa;
    border-top: 1px solid #e1e5e9;
    font-size: 12px;
    color: #6c757d;
}

.editor-stats {
    display: flex;
    gap: 16px;
}

/* Tiptap Content Styles */
:deep(.tiptap-content) {
    outline: none;
    line-height: 1.6;
}

:deep(.tiptap-content h1) {
    font-size: 2em;
    font-weight: bold;
    margin: 1em 0 0.5em 0;
}

:deep(.tiptap-content h2) {
    font-size: 1.5em;
    font-weight: bold;
    margin: 0.83em 0 0.5em 0;
}

:deep(.tiptap-content h3) {
    font-size: 1.17em;
    font-weight: bold;
    margin: 1em 0 0.5em 0;
}

:deep(.tiptap-content h4) {
    font-size: 1em;
    font-weight: bold;
    margin: 1.33em 0 0.5em 0;
}

:deep(.tiptap-content h5) {
    font-size: 0.83em;
    font-weight: bold;
    margin: 1.67em 0 0.5em 0;
}

:deep(.tiptap-content h6) {
    font-size: 0.67em;
    font-weight: bold;
    margin: 2.33em 0 0.5em 0;
}

:deep(.tiptap-content ul, .tiptap-content ol) {
    padding-left: 1.5em;
    margin: 1em 0;
}

:deep(.tiptap-content blockquote) {
    border-left: 4px solid #e1e5e9;
    margin: 1.5em 0;
    padding-left: 1em;
    font-style: italic;
    color: #6c757d;
}

:deep(.tiptap-content code) {
    background: #f8f9fa;
    color: #e83e8c;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.85em;
    font-family: 'Monaco', 'Consolas', 'Ubuntu Mono', monospace;
}

:deep(.tiptap-content pre) {
    background: #f8f9fa;
    color: #495057;
    padding: 1em;
    border-radius: 6px;
    overflow-x: auto;
    font-family: 'Monaco', 'Consolas', 'Ubuntu Mono', monospace;
    font-size: 0.85em;
    line-height: 1.4;
    margin: 1em 0;
}

:deep(.tiptap-content .custom-link) {
    color: #007bff;
    text-decoration: underline;
}

:deep(.tiptap-content .custom-image) {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    margin: 1em 0;
}

:deep(.tiptap-content table) {
    border-collapse: collapse;
    margin: 1em 0;
    overflow: hidden;
    table-layout: fixed;
    width: 100%;
    border: 1px solid #dee2e6;
    border-radius: 6px;
}

:deep(.tiptap-content table td, .tiptap-content table th) {
    border: 1px solid #dee2e6;
    box-sizing: border-box;
    min-width: 1em;
    padding: 8px;
    position: relative;
    vertical-align: top;
}

:deep(.tiptap-content table th) {
    background-color: #f8f9fa;
    font-weight: bold;
    text-align: left;
}

:deep(.tiptap-content .tableWrapper) {
    overflow-x: auto;
    margin: 1em 0;
}

:deep(.tiptap-content ul[data-type="taskList"]) {
    list-style: none;
    padding: 0;
}

:deep(.tiptap-content ul[data-type="taskList"] li) {
    display: flex;
    align-items: flex-start;
    margin: 0.5em 0;
}

:deep(.tiptap-content ul[data-type="taskList"] li > label) {
    flex: 0 0 auto;
    margin-right: 0.5rem;
    user-select: none;
}

:deep(.tiptap-content ul[data-type="taskList"] li > div) {
    flex: 1 1 auto;
}

:deep(.tiptap-content hr) {
    border: none;
    border-top: 2px solid #e1e5e9;
    margin: 2rem 0;
}

/* YouTube embed styles */
:deep(.tiptap-content .youtube-embed) {
    margin: 1em 0;
    text-align: center;
}

:deep(.tiptap-content .youtube-embed iframe) {
    max-width: 100%;
    border-radius: 6px;
}


:deep(.tiptap-content ul) {
    list-style-type: disc;
    padding-left: 1.5em;
    margin: 1em 0;
}

:deep(.tiptap-content ol) {
    list-style-type: decimal;
    padding-left: 1.5em;
    margin: 1em 0;
}

:deep(.tiptap-content li) {
    margin: 0.25em 0;
}

/* Task list specific styles */
:deep(.tiptap-content ul[data-type="taskList"]) {
    list-style: none;
    padding: 0;
}

:deep(.tiptap-content ul[data-type="taskList"] li) {
    display: flex;
    align-items: center;
}

:deep(.tiptap-content ul[data-type="taskList"] label) {
    margin-right: 0.5rem;
    display: flex;
    align-items: center;
}

:deep(.tiptap-content ul[data-type="taskList"] input[type="checkbox"]) {
    margin-right: 0.5rem;
}

/* Responsive toolbar */
@media (max-width: 768px) {
    .toolbar-container {
        padding: 8px;
        gap: 4px;
    }

    .toolbar-group {
        padding: 0 4px;
    }

    .toolbar-btn {
        font-size: 11px;
        padding: 4px 8px;
    }

    .editor-stats {
        flex-direction: column;
        gap: 4px;
    }
}
</style>