export default function ProviderNotFound() {
    return (
         <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-center">
              <p className="text-2xl font-semibold text-foreground">
                Provider Not Found
              </p>
              <p className="text-sm text-foreground mt-2">
                The provider you&apos;re looking for doesn&apos;t exist.
              </p>
            </div>
          </div>
    )
}