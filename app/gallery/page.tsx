import dbConnect from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import ArtworkGrid from "@/components/ArtworkGrid";
import AdminUploadButton from "@/components/AdminUploadButton";

export const revalidate = 60;

export default async function GalleryPage() {
    await dbConnect();

    const artworks = await Artwork.find({}).sort({ createdAt: -1 }).lean();

    const serializedArtworks = artworks.map((art: any) => ({
        _id: art._id.toString(),
        title: art.title,
        imageUrl: art.imageUrl,
        price: art.price,
        description: art.description,
    }));

    return (
        <div className="bg-background min-h-screen py-32 sm:py-48 px-6 sm:px-10 lg:px-20">
            <div className="container mx-auto">
                <div className="flex flex-col items-center text-center mb-32 max-w-4xl mx-auto space-y-10">
                    <div className="inline-block px-5 py-1.5 glass rounded-full">
                        <span className="text-[9px] font-bold tracking-[0.5em] text-brand-burgundy uppercase">The Archive</span>
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter uppercase text-foreground leading-[0.9]">
                        Studio <br />
                        <span className="italic font-light text-brand-burgundy">Collection</span>
                    </h1>
                    <p className="text-xs sm:text-base text-foreground/40 font-medium tracking-[0.2em] uppercase leading-relaxed max-w-2xl">
                        A definitive index of our most recent works. Each piece represents a unique intersection of raw emotion and disciplined craft.
                    </p>
                    <div className="pt-6">
                        <AdminUploadButton />
                    </div>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-burgundy/10 to-transparent blur-3xl opacity-20 -z-10 group-hover:opacity-30 transition-opacity duration-1000" />
                    <ArtworkGrid artworks={serializedArtworks} />
                </div>
            </div>
        </div>
    );
}


