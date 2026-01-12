type Props = {
    src: string;
    alt: string;
    onClick: () => void;
    width?: number;
    height?: number;
};

export default function IconButton({ src, alt, onClick, width = 20, height = 20 }: Props) {
    return (
        <button
            onClick={onClick}
            style={{
                border: "none",
                background: "transparent",
                padding: 4,
                cursor: "pointer",
            }}
        >
            <img src={src} alt={alt} width={width} height={height} />
        </button>
    );
}
