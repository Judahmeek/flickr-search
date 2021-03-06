class Image
  include ActiveModel::Model
  attr_accessor :id, :title, :username, :date_taken, :image_url

  def self.find_by(id)
    info = Rails.cache.fetch("#{id}") do
      FlickRaw.api_key ||= ENV['FLICKR_API_KEY']
      FlickRaw.shared_secret ||= ENV['FLICKR_API_SECRET']
      flickr.photos.getInfo(photo_id: id)
    end
    url_method = if defined? info.originalsecret then :url_o else :url_z end
    new(id: id, title: info.title, username: info.owner.username, image_url: FlickRaw.send(url_method, info), date_taken: info.dates.taken)
  end
end
