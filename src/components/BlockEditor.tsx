import { useEffect, useId, useRef } from 'react';
import type EditorJS from '@editorjs/editorjs';
import type { BlogContent } from '@/types/blog';
import { emptyBlogContent } from '@/lib/blockContent';
import { uploadBlogImage } from '@/lib/blogImages';

interface BlockEditorProps {
  value: BlogContent;
  onChange: (content: BlogContent) => void;
}

const BlockEditor = ({ value, onChange }: BlockEditorProps) => {
  const holderId = useId();
  const editorRef = useRef<EditorJS | null>(null);
  const onChangeRef = useRef(onChange);
  const initialValueRef = useRef(value);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let cancelled = false;

    const initEditor = async () => {
      const EditorJSModule = await import('@editorjs/editorjs');
      const Header = (await import('@editorjs/header')).default;
      const List = (await import('@editorjs/list')).default;
      const Quote = (await import('@editorjs/quote')).default;
      const CodeTool = (await import('@editorjs/code')).default;
      const ImageTool = (await import('@editorjs/image')).default;

      if (cancelled) {
        return;
      }

      const Editor = EditorJSModule.default;
      editorRef.current = new Editor({
        holder: holderId,
        data: initialValueRef.current?.blocks?.length ? initialValueRef.current : emptyBlogContent(),
        autofocus: true,
        placeholder: 'Write your article...',
        onChange: async () => {
          if (!editorRef.current) {
            return;
          }

          const data = await editorRef.current.save();
          onChangeRef.current(data as BlogContent);
        },
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              levels: [1, 2, 3],
              defaultLevel: 2,
            },
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
          },
          code: {
            class: CodeTool,
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile: async (file: File) => {
                  const publicUrl = await uploadBlogImage(file);

                  return {
                    success: 1,
                    file: {
                      url: publicUrl,
                    },
                  };
                },
              },
            },
          },
        },
      });
    };

    void initEditor();

    return () => {
      cancelled = true;
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [holderId]);

  useEffect(() => {
    if (!editorRef.current || !value?.blocks?.length) {
      return;
    }

    void editorRef.current.isReady.then(async () => {
      if (!editorRef.current) {
        return;
      }

      const current = await editorRef.current.save();
      const samePayload = JSON.stringify(current.blocks) === JSON.stringify(value.blocks);
      if (!samePayload) {
        await editorRef.current.render(value);
      }
    });
  }, [value]);

  return <div id={holderId} className="min-h-[360px] rounded-md border border-input bg-background p-4" />;
};

export default BlockEditor;
