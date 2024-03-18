export default function Callout(props: any) {
  return (
    <div className="mt-3">
      {props.title ? (
        <div className="bg-stone-700 px-2 text-white w-fit p-1 rounded-lg font-smallcaps relative left-7 font-bold top-4  ">
          {props.title}
        </div>
      ) : null}
      <div className="bg-orange-100 border-l-[5px] text-amber-800 [&>p]:text-lg [&>p]:font-serif  border-y-2 border-r-2 border-stone-600 px-5 pt-5 pb-3 rounded-lg">
        {props.children}
      </div>
    </div>
  );
}

