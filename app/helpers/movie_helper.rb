module MovieHelper

  def canistreamit_iframe_url(movie)
    @canistreamit_url ||= begin
      movie_id = canistreamit_movie_id(movie)
      url = nil
      unless movie_id.nil?
        url = "http://www.canistream.it/external/movie/#{movie_id}"
      end
      url
    end
  end

  private

  def canistreamit_movie_id(movie)
    client = Canistreamit::Client.new

    results = client.search(movie.title)
    year = movie.release_date.split('-')[0].to_i
    results.each do |result|
      if (year == result['year'])
        return result['_id']
      end
    end
  end
end
