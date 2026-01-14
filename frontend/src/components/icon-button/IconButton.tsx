import { Button } from "./IconButton.styles";

type Props = {
    src: string;
    alt: string;
    onClick: () => void;
    width?: number;
    height?: number;
};

export default function IconButton({ src, alt, onClick, width = 20, height = 20 }: Props) {
    return (
        <Button onClick={onClick}>
            <img src={src} alt={alt} width={width} height={height} />
        </Button>
    );
}
