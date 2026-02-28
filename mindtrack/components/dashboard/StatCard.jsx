export default function StatCard({ value, label, color }) {
    const colorMap = {
        blue: 'text-blue-600 bg-blue-50',
        green: 'text-green-600 bg-green-50',
        purple: 'text-purple-600 bg-purple-50',
        orange: 'text-orange-600 bg-orange-50',
    };

    return (
        <div className={`p-4 rounded-2xl text-center ${colorMap[color]}`}>
            <div className="text-3xl font-bold mb-1">{value}</div>
            <div className="text-sm text-gray-600">{label}</div>
        </div>
    );
}
