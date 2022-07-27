export class CreateCourseDto {
  title: string;
  bio: string;
  description: string;
  requirements: string;
  forWho: string;
  languages: string[];
  imageUrl: string;
  previewURl: string;
  discount: number;
  discountStart: string;
  discountEnd: string;
  discountCodes: string[];
  price: number;
  // isPublished: boolean;
}
