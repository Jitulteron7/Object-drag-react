import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface EditorState {
  value: {
    innerElement: EditorInnerElement;
    innerElements: EditorInnerElement[];
    editorWrapper: EditorWrapper;
  };
}

export interface PointsRef {
  midBottomRef: { x: number; y: number } | null;
  midTopRef: { x: number; y: number } | null;
  midLeftRef: { x: number; y: number } | null;
  midRightRef: { x: number; y: number } | null;
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

  pointsRef?: PointsRef;
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
      pointsRef: {
        midBottomRef: null,
        midTopRef: null,
        midLeftRef: null,
        midRightRef: null,
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
    innerElementsEdit: (state, action: PayloadAction<any>) => {
      // console.log(action.payload, 'payload');

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
      const elm = action.payload;
      state.value.innerElements.push(elm as any);
    },

    isSelectedWrapper: (
      state,
      action: PayloadAction<EditorInnerElement | null>
    ) => {
      if (action?.payload !== null) {
        state.value.innerElements = state.value.innerElements.map((innElm) => {
          if (innElm.id === action.payload?.id) {
            return {
              ...innElm,
              isSelected: true,
            };
          } else {
            return {
              ...innElm,
              isSelected: false,
            };
          }
        });
        return;
      }

      state.value.innerElements = state.value.innerElements.map((innElm) => {
        return {
          ...innElm,
          isSelected: false,
        };
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  isSelectedWrapper,

  addElementInEditor,
  innerElementsEdit,
} = editorSlice.actions;

export default editorSlice.reducer;
