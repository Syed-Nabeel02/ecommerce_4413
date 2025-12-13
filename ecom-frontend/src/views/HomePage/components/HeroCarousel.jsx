import { bannerLists } from '../../../utilities/bannerData';
import { Link } from 'react-router-dom';

/**
 * HeroCarousel Component (now static)
 *
 * Displays a static hero banner with 3 product images and a call-to-action.
 *
 * @returns {JSX.Element} Static hero banner component
 */
const HeroCarousel = () => {
    return (
        // Main container with red gradient background
        <div className='py-8 px-4 rounded-lg shadow-lg bg-gradient-to-br from-red-600 via-red-700 to-red-800 overflow-hidden relative'>

            {/* Subtle overlay for depth */}
            <div className='absolute inset-0 bg-black opacity-5'></div>

            {/* Content container */}
            <div className='relative z-10 max-w-7xl mx-auto'>

                {/* Header section - centered text and CTA */}
                <div className='text-center mb-12'>
                    {/* Main heading */}
                    <h1 className='text-4xl md:text-5xl lg:text-6xl text-white font-extrabold leading-tight mb-4'>
                        York University Official Store
                    </h1>

                    {/* Subheading */}
                    <p className='text-lg md:text-xl text-white font-medium mb-8 opacity-90 max-w-2xl mx-auto'>
                        Shop authentic York U hoodies, tees, caps and campus collectibles — show your pride.
                    </p>

                    {/* Call-to-action button */}
                    <Link
                        className='inline-block bg-white text-red-800 font-bold py-4 px-10 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105'
                        to="/products">
                        Shop York Merch
                    </Link>
                </div>

                {/* Product images grid */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-12'>
                    {bannerLists.map((item) => (
                        <div
                            key={item.id}
                            className='bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/20'>

                            {/* Product image */}
                            <div className='flex justify-center items-center h-64 mb-4'>
                                <img
                                    src={item.image}
                                    alt={item.subtitle}
                                    className='max-h-full object-contain drop-shadow-2xl'
                                />
                            </div>

                            {/* Product info */}
                            <div className='text-center'>
                                <p className='text-sm text-white/80 font-semibold tracking-wide uppercase mb-1'>
                                    {item.title}
                                </p>
                                <h3 className='text-xl font-bold text-white mb-2'>
                                    {item.subtitle}
                                </h3>
                                <p className='text-sm text-white/70'>
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HeroCarousel;