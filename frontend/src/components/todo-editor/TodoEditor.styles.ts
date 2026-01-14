import styled from "styled-components";

export const Form = styled.form`
    border-radius: 12px;
    padding: 12px;
    background: #2b2b2b;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.2);
`;

export const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
`;

export const Label = styled.b`
    width: 90px;
    text-align: start;
    color: #e5e5e5;
    font-weight: 600;
`;

export const TextInput = styled.input`
    flex: 1;
    outline: none;
    font-size: 16px;
    padding: 5px 20px;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    background: #1f1f1f;
    color: #ffffff;

    &::placeholder {
        color: #9ca3af;
    }
`;

export const DateInput = styled.input`
    flex: 1;
    outline: none;
    font-size: 14px;
    padding: 5px 20px;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    background: #1f1f1f;
    color: #ffffff;
`;

export const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 12px;
`;

export const CancelButton = styled.button`
    border: none;
    background: transparent;
    color: #e5e5e5;
    cursor: pointer;
    padding: 6px 12px;

    &:hover {
        opacity: 0.85;
    }
`;

export const SubmitButton = styled.button`
    padding: 6px 12px;
    border-radius: 8px;
    border: none;
    background: #118ab2;
    color: #ffffff;
    cursor: pointer;
    font-weight: 600;

    &:hover {
        opacity: 0.9;
    }
`;
