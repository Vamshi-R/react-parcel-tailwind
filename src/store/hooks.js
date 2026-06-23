import { useDispatch, useSelector } from 'react-redux';

/**
 * Typed-friendly wrappers around react-redux hooks.
 * Use these throughout the app instead of the raw hooks so that
 * swapping in TypeScript types later only requires changes here.
 */
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
