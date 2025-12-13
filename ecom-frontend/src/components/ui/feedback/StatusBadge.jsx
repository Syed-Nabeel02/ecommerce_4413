/**
 * StatusBadge.jsx
 * Status badge component with icon.
 * Renamed from Status for better clarity.
 */

const StatusBadge = ({text, icon:Icon, bg, color}) => {
    return (
        <div
            className={`${bg} ${color} px-2 py-2 font-medium rounded-sm flex items-center gap-1`}>
            {text} <Icon size={15} />
        </div>
    )
};

export default StatusBadge;