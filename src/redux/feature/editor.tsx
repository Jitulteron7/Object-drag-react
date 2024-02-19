import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface EditorState {
  value: {
    innerElement: EditorInnerElement;
    editorWrapper: EditorWrapper;
  };
}

export interface EditorInnerElement {
  origin: {
    x: number;
    y: number;
  };
  styles: React.CSSProperties;
}

export interface EditorWrapper {
  isSelected: boolean;
}

const initialState: EditorState = {
  value: {
    innerElement: {
      origin: {
        x: 0,
        y: 0,
      },
      styles: {
        height: 100,
        width: 100,
        left: 100,
        top: 100,
      },
    },
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
      console.log(action.payload.styles, 'stylse');

      state.value.innerElement = {
        ...state.value.innerElement,
        styles: {
          ...state.value.innerElement.styles,
          ...action.payload.styles,
        },
      };
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
export const { isSelectedWrapper, innerElementStyle } = editorSlice.actions;

export default editorSlice.reducer;
