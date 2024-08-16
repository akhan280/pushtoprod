
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getPostsForSite, getSiteData } from "@/lib/fetchers";
import { getSession } from "../../lib/auth";
import { Contact, Footer, Header, LocalSiteData, Media, MediaItem, Section, SiteProjects, Social, TextBox } from "../../components/site/site-interfaces";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/plate-ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../components/ui/carousel";
import { Card, CardContent } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import ProjectsDisplay, { SitePlateEditor } from "./project-render";

export async function generateStaticParams() {
  const allSites = await prisma.site.findMany({
    select: {
      subdomain: true,
      customDomain: true,
    },
  });

  const allPaths = allSites
    .flatMap(({ subdomain, customDomain }) => [
      subdomain && {
        domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      },
      customDomain && {
        domain: customDomain,
      },
    ])
    .filter(Boolean);

  return allPaths;
}

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {

  const domain = decodeURIComponent(params.domain);

  const [data, posts] = await Promise.all([
    getSiteData(domain),
    getPostsForSite(domain),
  ]);

  if (!data) {
    notFound();
  }

  const siteJson = JSON.parse(data!.sections as string);
  const siteData: LocalSiteData = {
    ...data!, 
    parsedSections: siteJson as Section[]
  };

  return (
    <>
        (return <StaticSiteRender siteData={siteData} domain={domain} />);
    </>
  );
}


export function StaticSiteRender({siteData, domain}: {siteData: LocalSiteData, domain: string}) {
  return(
    <div>
        <div className="flex flex-col justify-center items-center">
          <div>

            {siteData.parsedSections.map((section) => (
              <SectionComponent
                key={section.id}
                section = {section}
                domain = {domain}
              />
            ))}
          </div>
        </div>
    </div>
  )
}



function SectionComponent({ section, domain }: { section: Section , domain: string }) {

  const isHeader = (content: any): content is Header => 'title' in content;
  const isTextBox = (content: any): content is TextBox => 'content' in content;
  const isContact = (content: any): content is Contact => 'socials' in content;
  const isMedia = (content: any): content is Media => 'mediaItems' in content;
  const isFooter = (content: any): content is Footer => 'quote' in content;

  const renderContent = () => {
    switch (section.type) {
      case 'header':
        return isHeader(section.content) ? (
          <div className="flex flex-row gap-3">
            <ProfileHeader
              imageUrl={section.content.profileUrl}
              title={section.content.title}
            />
          </div>
        ) : null;
      case "textbox":
        return isTextBox(section.content) ?
          <div>
            <SitePlateEditor content={(section.content as TextBox).content}></SitePlateEditor>
          </div> : 
          <div></div>;
      case "contact":
        return isContact(section.content) ? <div>
          <ShowContact socials={(section.content as Contact).socials}></ShowContact>
          </div> : null;
      case "projects":
        return <div><ProjectsDisplay section={section} domain={domain}></ProjectsDisplay></div>;
      case "media":
        return isMedia(section.content) ? (
          <MediaCarousel mediaItems={ (section.content as Media).mediaItems || []}></MediaCarousel>
        ) : null;
      case "footer":
        return isFooter(section.content) ? <FooterDialog quote={(section.content as Footer).quote}  /> : null;
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-row flex-shrink-0 flex-grow-0`}>
      <div>
        {renderContent()}
      </div>
    </div>
  );
}

function ProfileHeader({imageUrl, title }: {imageUrl: string, title: string }) {
  return (
    <div className="flex flex-row gap-3 items-center">
        {imageUrl ? (
          <Avatar>
            <AvatarImage width={30} height={30} src={imageUrl} alt={title} />
            <AvatarFallback>{title[0]}</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar>
            <AvatarFallback className="bg-gray-300">{title[0]}</AvatarFallback>
          </Avatar>
        )}
        <div>{title}</div>
    </div>
  );
}

function ShowContact({ socials }: { socials: Social[] }) {
  return (
    <div>
      {socials.map((social, index) => (
        social.display && (
          <div key={index} href={social.url}>
            {social.platform}
          </div>
        )
      ))}
    </div>
  )
}

function MediaCarousel({mediaItems }: { mediaItems: MediaItem[]}) {
  return (
    <div className="media-carousel">
      <Carousel className="w-full max-w-sm">
        <CarouselContent className="-ml-1">
            <>
              {mediaItems.map((mediaItem, index) => (
                <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        {mediaItem.type === 'image' ? (
                          <img
                            src={mediaItem.href}
                            alt={mediaItem.alt || 'Image'}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <video
                            src={mediaItem.href}
                            className="object-cover w-full h-full"
                            controls
                          />
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

function FooterDialog({quote }: { quote: string }) {

  return (
    <div>
      <Label> {quote} </Label>

      </div>

  );
}

