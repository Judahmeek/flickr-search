class Image
  include ActiveModel::Model
  attr_accessor :id, :title, :username, :date_taken, :image_url

  def self.find_by(id:)
    info = Rails.cache.fetch("#{params[:id]}", expires_in: 24.hours) {flickr.photos.getInfo(photo_id: id)}
    new(id: id, title: info.title, username: info.owner.username, image_url: FlickRaw.url_z(info), date_taken: info.dates.taken)
  end
end
