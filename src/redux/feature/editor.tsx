import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface EditorState {
  value: {
    innerElement: EditorInnerElement;
    innerElements: EditorInnerElement[];
    editorWrapper: EditorWrapper;
  };
}

export interface EditorInnerElement {
  id?: string;
  origin: {
    x: number;
    y: number;
  };
  tranlation?: { x: number; y: number };
  resizeOrg: {
    x: number;
    y: number;
  };

  dir?: number;
  isResize?: boolean;
  isSelected?: boolean;
  isDragging?: boolean;

  styles: React.CSSProperties;
}

export interface EditorWrapper {
  isSelected: boolean;
}

const initialState: EditorState = {
  value: {
    innerElement: {
      origin: {
        x: 100,
        y: 100,
      },
      tranlation: { x: 100, y: 100 },
      dir: -1,
      isResize: false,
      isSelected: false,
      isDragging: false,
      resizeOrg: {
        x: 100,
        y: 100,
      },
      styles: {
        height: 100,
        width: 100,
        left: 100,
        top: 100,
      },
    },
    innerElements: [],
    editorWrapper: {
      isSelected: false,
    },
  },
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    innerElementStyle: (
      state,
      action: PayloadAction<Partial<EditorInnerElement>>
    ) => {
      state.value.innerElement = {
        ...state.value.innerElement,
        styles: {
          ...state.value.innerElement.styles,
          ...action.payload.styles,
        },
      };
    },

    innerElementsEdit: (
      state,
      action: PayloadAction<Partial<EditorInnerElement>>
    ) => {
      state.value.innerElements = state.value.innerElements.map((innElm) => {
        if (innElm.id === action.payload.id) {
          return {
            ...innElm,
            ...action.payload,
          };
        } else {
          return innElm;
        }
      });
    },
    addElementInEditor: (state, action: PayloadAction<EditorInnerElement>) => {
      state.value.innerElements.push(action.payload);
    },
    innerElementsOrigin: (
      state,
      action: PayloadAction<Partial<EditorInnerElement>>
    ) => {
      state.value.innerElements = state.value.innerElements.map((innElm) => {
        if (innElm.id === action.payload.id) {
          return {
            ...innElm,
            origin: {
              x: action.payload.origin?.x as number,
              y: action.payload.origin?.y as number,
            },
          };
        } else {
          return innElm;
        }
      });
    },

    innerElementOrigin: (
      state,
      action: PayloadAction<Partial<EditorInnerElement>>
    ) => {
      state.value.innerElement = {
        ...state.value.innerElement,
        origin: {
          x: action.payload.origin?.x as number,
          y: action.payload.origin?.y as number,
        },
      };
    },
    isSelectedWrapper: (state, action: PayloadAction<boolean>) => {
      state.value.editorWrapper.isSelected = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  isSelectedWrapper,
  innerElementStyle,
  addElementInEditor,
  innerElementsEdit,
} = editorSlice.actions;

export default editorSlice.reducer;
