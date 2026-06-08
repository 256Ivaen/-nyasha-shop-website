interface TitleProps {
  text1: string
  text2: string
  alignment?: 'left' | 'center' | 'right'
  size?: 'small' | 'default' | 'large' | 'xlarge'
}

const sizeClasses = {
  small: 'text-xs md:text-xs',
  default: 'text-xs md:text-xs',
  large: 'text-xs md:text-xs',
  xlarge: 'text-xs md:text-xs',
}

export default function Title({ text1, text2, alignment = 'center', size = 'default' }: TitleProps) {
  const titleSize = sizeClasses[size] ?? sizeClasses.default
  const alignClass = alignment === 'center' ? 'text-center justify-center' : alignment === 'right' ? 'text-right justify-end' : 'text-left'
  return (
    <h2 className={`font-bold ${titleSize} flex items-center gap-2 ${alignClass}`}>
      <span className="text-gray-800">{text1}</span>
      <span className="text-primary">{text2}</span>
    </h2>
  )
}
