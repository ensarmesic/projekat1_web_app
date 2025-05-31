output "alb_dns_name" {
  value = aws_lb.app_lb.dns_name
}

output "alb_url" {
  value = "http://${aws_lb.app_lb.dns_name}"
}