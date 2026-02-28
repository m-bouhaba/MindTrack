export default function SectionTitle({ title, subtitle }) {
    return (
        <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
    );
}
