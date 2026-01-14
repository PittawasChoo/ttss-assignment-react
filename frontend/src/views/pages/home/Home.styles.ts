import styled from "styled-components";

export const LoadingContainer = styled.div`
    padding: 16px;
    color: #e5e5e5;
`;

export const ErrorContaier = styled.div`
    padding: 16px;
    color: red;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
`;

export const RefreshButton = styled.div`
    padding: 6px 12px;
    border-radius: 8px;
    border: none;
    background: #118ab2;
    color: #fff;
    cursor: pointer;
`;

export const TodosContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

export const Line = styled.div`
    width: 100%;
    height: 1px;
    background-color: white;
    margin: 20px 0;
`;

export const AddTaskRow = styled.div`
    display: flex;
    margin-left: 40px;
    cursor: pointer;
    align-items: center;

    &:hover .plus {
        background-color: #929090;
        color: black;
    }

    &:hover .label {
        color: white;
    }
`;

export const Plus = styled.div`
    color: #6e6e6e;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    transition: background-color 0.15s ease, color 0.15s ease;
`;

export const Label = styled.div`
    color: #6e6e6e;
    transition: color 0.15s ease;
`;
