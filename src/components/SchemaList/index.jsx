import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

const SortableItem = SortableElement(({ value }) => (
    <li className="cursor-pointer text-black dark:text-white py-1" tabIndex={0}>{value}</li>
))

const SortableList = SortableContainer(({ items }) => {
    return (
        <ul className='list-none'>
            {items.map((value, index) => (
                <SortableItem key={`item-${value}`} index={index} value={value} />
            ))}
        </ul>
    )
})

const SchemaList = ({ className, nftItems, jsonItems, setNftItems, setJsonItems }) => {
    const onSortEnd1 = ({ oldIndex, newIndex }) => {
        setNftItems(prev => arrayMove(prev, oldIndex, newIndex));
    }

    const onSortEnd2 = ({ oldIndex, newIndex }) => {
        setJsonItems(prev => arrayMove(prev, oldIndex, newIndex));
    }

    return (
        <div className={`w-full flex flex-col px-4 py-2 text-sm border rounded-2xl border-neutral-200 bg-white dark:border-neutral-600 dark:bg-[#191818] ${className}`}>
            <div className='grid grid-cols-2 py-1 border-b border-neutral-200 dark:border-neutral-600 mb-2'>
                <span className='text-md'>NFT</span>
                <span className='text-md'>JSON</span>
            </div>
            <div className='grid grid-cols-2'>
                {nftItems.length > 0 ? (
                    <SortableList items={nftItems} onSortEnd={onSortEnd1} />
                ) : (<div></div>)}
                {jsonItems.length > 0 ? (
                    <SortableList items={jsonItems} onSortEnd={onSortEnd2} />
                ) : (<div></div>)}
            </div>
        </div>
    )
}

export default SchemaList;