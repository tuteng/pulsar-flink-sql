import {
  IEditorFactoryService,
  CodeEditor,
  CodeEditorWrapper
} from '@jupyterlab/codeeditor';

// import { Widget } from '@lumino/widgets';
import { ISignal, Signal } from '@lumino/signaling';

export interface IEditor {
  readonly widget: EditorWidget;
  readonly value: string;
}

export interface IInput {
  content: string;
}

export class Editor implements IEditor {
  constructor(initialValue: string, editorFactory: IEditorFactoryService) {
    this._model = new CodeEditor.Model({ value: initialValue });
    this._widget = new EditorWidget(this._model, editorFactory);
    this._model.mimeType = 'text/x-sql';
  }

  get value(): string {
    return this._model.value.text;
  }

  get widget(): EditorWidget {
    return this._widget;
  }

  private _widget: EditorWidget;
  private _model: CodeEditor.IModel;
}

export class EditorWidget extends CodeEditorWrapper {
  constructor(model: CodeEditor.IModel, editorFactory: IEditorFactoryService) {
    super({
      model,
      factory: editorFactory.newInlineEditor
    });

    this.addClass('pf-sql-editor');
    this.editor.addKeydownHandler((_, evt) => this._onKeydown(evt));
  }

  private _onKeydown(event: KeyboardEvent): boolean {
    if (event.key === 'Enter' && !event.shiftKey) {
      const content = this.model.value.text;
      this._stateChanged.emit(content);
      return true;
    }
    return false;
  }

  private _stateChanged = new Signal<EditorWidget, string>(this);

  public get stateChanged(): ISignal<EditorWidget, string> {
    return this._stateChanged;
  }
}
