import { useReducer } from 'react'

export type FormStateT = {
    email: string
    password: string
}
export const initialState: FormStateT = {
    email: '',
    password: '',
}
export type Actions =
    | { t: 'INPUT_EMAIL'; data: string }
    | { t: 'INPUT_PASSWORD'; data: string }

const initializeState = () => ({ email: '', password: '' })

function reducer(state: FormStateT, action: Actions) {
    switch (action.t) {
        case 'INPUT_EMAIL':
            return { ...state, email: action.data }
        case 'INPUT_PASSWORD':
            return { ...state, password: action.data }
        default:
            return state
    }
}

export const useSignIn = () => {
    const [stateForm, dispatch] = useReducer(
        reducer,
        initialState,
        initializeState
    )

    return { stateForm, dispatch }
}
