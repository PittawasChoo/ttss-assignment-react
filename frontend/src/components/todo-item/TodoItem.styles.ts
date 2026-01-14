import styled from "styled-components";

export const Wrapper = styled.div`
    padding: 12px;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    width: 420px;

    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0px 1px 8px 2px rgba(0, 0, 0, 0.2);
    background-color: #242424;
`;

export const Left = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`;

export const DragHandle = styled.img<{ disabled: boolean }>`
    width: 16px;
    height: 16px;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "grab")};
    opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`;

export const Content = styled.div`
    text-align: start;
`;

export const Description = styled.span<{ finished: boolean }>`
    text-decoration: ${({ finished }) => (finished ? "line-through" : "none")};
`;

export const DueDate = styled.small<{ overdue: boolean }>`
    opacity: 0.7;
    color: ${({ overdue }) => (overdue ? "red" : "white")};
`;

export const Actions = styled.div`
    display: flex;
    gap: 6px;
`;
