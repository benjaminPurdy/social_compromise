require 'rest_client'

class RestfulServices

  def self.get(uri, username=nil)
    RestClient.get(uri.to_s, {'HTTP_USER' => username})
  end

  def self.get_JSON(uri, username)
    res = RestClient.get(uri.to_s, {:content_type => :json, 'HTTP_USER' => username})
    begin
      JSON.parse(res.body)
    rescue ParseError => e
      render :text => "Now there's some ugly JSON! (#{res})", :status => 500
    end
  end

  def self.post_JSON(uri, username, body)
    res = RestClient.post(uri.to_s, body.to_json, {:content_type => :json, 'HTTP_USER' => username})
    begin
      JSON.parse(res.body)
    rescue ParseError => e
      puts res
      render :text => "Now there's some ugly JSON! (#{res})", :status => 500
    end
  end

  def self.delete_JSON(uri, username)
    res = RestClient.delete(uri.to_s, {:content_type => :json, 'HTTP_USER' => username})
    begin
      JSON.parse(res.body)
    rescue ParseError => e
      render :text => "Now there's some ugly JSON! (#{res})", :status => 500
    end
  end

  def self.put_JSON(uri, username, body)
    res = RestClient.put(uri.to_s, body.to_json, {:content_type => :json, 'HTTP_USER' => username})
    begin
      JSON.parse(res.body)
    rescue ParseError => e
      render :text => "Now there's some ugly JSON! (#{res})", :status => 500
    end
  end
end