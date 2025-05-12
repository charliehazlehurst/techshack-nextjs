import Image from "next/image";
import Link from "next/link";

const services = [
  {
    title: "GENERAL ASSESSMENT",
    price: "Starting From: £20",
    description:
      "This service is added onto total price when the fault is unknown. (Assessment of the device to determine faults)",
    imgSrc: "/images/engine.jpg",
    altText: "GENERAL ASSESSMENT",
  },
  {
    title: "GENERAL MAINTENANCE",
    price: "Starting From: £30",
    description:
      "A deep clean on your device. From Accessories to Whole Devices (whole surface, all ports, microphones, inside of device, etc.)",
    imgSrc: "/images/conv.jpg",
    altText: "GENERAL MAINTENANCE",
  },
  {
    title: "HARDWARE / SCREEN REPAIR",
    price: "Starting From: £30",
    description:
      "This service is required when there is a faulty or damaged part that may need repairing or replacing in your device, from Battery Replacements to Port Repairs to Phone Screen Replacements to Motherboard Replacements!",
    imgSrc: "/images/pet.jpg",
    altText: "HARDWARE / SCREEN REPAIR",
  },
  {
    title: "DATA RECOVERY",
    price: "£25 per Device",
    description: "Need to recover data from a broken device? Book this service to restore all of your valuable pictures, etc.",
    imgSrc: "/images/glass.jpg",
    altText: "DATA RECOVERY",
  },
  {
    title: "VIRUS REMOVAL",
    price: "£50 per Device",
    description: "Need to remove viruses from a compromised device? Book this service to remove viruses.",
    imgSrc: "/images/virus.jpg",
    altText: "VIRUS REMOVAL",
  },
];

const ServicesPage = () => {
  return (
    <div>
      <header className="flex justify-between items-center py-4 px-8 bg-gray-100">
        <div className="logo">
          <Link href="/">
            <Image src="/images/logo.jpg" alt="Tech Shack Logo" width={100} height={100} />
          </Link>
        </div>
      </header>

      <main className="py-12 px-4 md:px-16">
        <h1 className="text-4xl font-extrabold text-center mb-10">OUR AVAILABLE SERVICES!</h1>

        {services.map((service, index) => (
          <div key={index} className="flex flex-col md:flex-row items-center mb-10">
            <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
              <Image
                src={service.imgSrc}
                alt={service.altText}
                width={250}
                height={250}
                className="rounded-md object-contain"
              />
            </div>
            <div className="w-full md:w-2/3 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
              <h3 className="text-xl mb-4">{service.price}</h3>
              <p className="text-lg">{service.description}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default ServicesPage;
