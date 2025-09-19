import { BeforeRemove, Column, Entity } from 'typeorm';
import { CommonEntity } from '../common/common.entity';
import { MediaType } from '../../constants/appConstant';
import { deleteFile } from '../../utils/media/migrateMedia';
import { PathUtil } from '../../utils/media/mediaPath';

@Entity()
export class Media extends CommonEntity {
  @Column({ name: 'mime_type' })
  mimeType: string;

  @Column({ name: 'file_name' })
  name: string;

  @Column({ name: 'file_size' })
  fileSize: string;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  mediaType: MediaType;

  @Column({ name: 'file_path' })
  path: string;

  @BeforeRemove()
  async deleteFile() {
    switch (this.mediaType) {
      case MediaType.BLOG_THUMBNAIL:
        const filePath = PathUtil.generateMediaPathForBlog(this.id) + this.name;
        console.log('Deleting Blog Thumbnail:', filePath);
        await deleteFile(filePath);
        break;
    }
  }
}
