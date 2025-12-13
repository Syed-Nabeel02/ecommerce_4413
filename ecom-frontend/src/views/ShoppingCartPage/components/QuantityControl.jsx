/**
 * QuantityControl.jsx
 * Quantity selector with increment/decrement buttons.
 * Renamed from QuantitySelector for better clarity.
 */

const btnStyles = 'border-[1.2px] border-slate-800 px-3 py-1 rounded-sm';

const QuantityControl = ({ quantity, cardCounter, onIncrease, onDecrease }) => {
  return (
    <div className="flex gap-8 items-center">
      {cardCounter ? null : <div className="font-semibold">QUANTITY</div>}
      <div className="flex md:flex-row flex-col gap-4 items-center lg:text-[22px] text-sm">
        <button disabled={quantity <= 1} className={btnStyles} onClick={onDecrease}>
          -
        </button>
        <div className="text-red-500">{quantity}</div>
        <button className={btnStyles} onClick={onIncrease}>
          +
        </button>
      </div>
    </div>
  );
};

export default QuantityControl;
