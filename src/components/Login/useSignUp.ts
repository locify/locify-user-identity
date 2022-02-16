import { useReducer } from 'react'

export type FormSignUpStateT = {
    email: string
    password: string
    password2: string
}
export const initialState: FormSignUpStateT = {
    email: '',
    password: '',
    password2: '',
}
export type Actions =
    | { t: 'INPUT_EMAIL'; data: string }
    | { t: 'INPUT_PASSWORD'; data: string }
    | { t: 'INPUT_PASSWORD2'; data: string }

const initializeState = () => ({ email: '', password: '', password2: '' })

function reducer(state: FormSignUpStateT, action: Actions) {
    switch (action.t) {
        case 'INPUT_EMAIL':
            return { ...state, email: action.data }
        case 'INPUT_PASSWORD':
            return { ...state, password: action.data }
        case 'INPUT_PASSWORD2':
            return { ...state, password2: action.data }
        default:
            return state
    }
}

export const useSignUp = () => {
    const [stateForm, dispatch] = useReducer(
        reducer,
        initialState,
        initializeState
    )

    return { stateForm, dispatch }
}
